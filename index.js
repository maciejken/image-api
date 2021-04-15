const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const responseTime = require('response-time');
const helmet = require('helmet');
const path = require('path');
const http = require('http');
const redis = require('redis');
const session = require('express-session');
const passport = require('passport');
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const logger = require('./libs/logger')('server');
const errorHandler = require('./middleware/errors/error-handler');

const app = express();
const { allowedOrigin } = require('./config');
logger.debug(`access control allowed origin is "${allowedOrigin}"`);
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 *24
  },
  rolling: true,
}));
app.use(cookieParser());
app.use(helmet());
app.use(responseTime());

const logRequestStart = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}, client IP ${req.ip}`);
  next()
};
app.use(logRequestStart);

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.resolve('./public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));
require('./routes/app.routes')(app);

const logRequestError = (req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} route not found`);
  next();
};
app.use(logRequestError);
app.use(errorHandler);

const port = process.env.PORT;

http
  .createServer(app)
  .listen(port, () => {
    logger.info(`server listening on port ${port}`);
});
