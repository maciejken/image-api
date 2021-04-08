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
const allowedOrigin = process.env.ALLOWED_ORIGIN;
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
  }
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

const { apiPrefix } = require('./config');
logger.debug(`API prefix is "${apiPrefix}"`);

app.use(`/auth`, require('./routes/auth.routes'));

app.use(`${apiPrefix}/users`, require('./routes/user.routes'));
app.use(`${apiPrefix}/groups`, require('./routes/group.routes'));
app.use(`${apiPrefix}/images`, require('./routes/images.routes'));
app.use(`${apiPrefix}/uploads`, require('./routes/uploads.routes'));
app.use(`${apiPrefix}/cv`, require('./routes/cv.routes'));
app.use(`${apiPrefix}/experiences`, require('./routes/experience.routes'));

app.use(express.static(path.resolve('./public')));
// app.get('/cv/*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'public/cv', 'index.html'));
// });
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));
app.get('/',
  // (req, res, next) => {
  //   console.log(req.session);
  //   console.log(req.user);
  //   next();
  // },
  (req, res) => {
    const { viewCount } = req.session;
    if (req.isAuthenticated()) {
      if (req.session.viewCount) {
        req.session.viewCount += 1;
      } else {
        req.session.viewCount = 1;
      }
      res.render('index', { user: req.user, viewCount });
    } else {
      res.redirect('/sad-face');
    }
  });

app.get('/sad-face', (req, res) => {
  res.render('sad-face');
});

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
