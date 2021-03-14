const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const responseTime = require('response-time');
const helmet = require('helmet');
const path = require('path');
const http = require('http');

const logger = require('./libs/logger')('server');
const errorHandler = require('./middleware/errors/error-handler');

const app = express();
const allowedOrigin = process.env.ALLOWED_ORIGIN;
logger.debug(`access control allowed origin is "${allowedOrigin}"`);
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(responseTime());

const logRequestStart = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}, client IP ${req.ip}`);
  next()
};
app.use(logRequestStart);

const apiPrefix = process.env.API_PREFIX;
logger.debug(`API prefix is "${apiPrefix}"`);

app.use(`${apiPrefix}/auth`, require('./routes/auth.routes'))
app.use(`${apiPrefix}/users`, require('./routes/user.routes'));
app.use(`${apiPrefix}/groups`, require('./routes/group.routes'));
app.use(`${apiPrefix}/images`, require('./routes/images.routes'));
app.use(`${apiPrefix}/uploads`, require('./routes/uploads.routes'));
app.use(`${apiPrefix}/cv`, require('./routes/cv.routes'));
app.use(`${apiPrefix}/experiences`, require('./routes/experience.routes'));

app.use(express.static(path.resolve('./public')));
app.get('/cv/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/cv', 'index.html'));
});
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
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
