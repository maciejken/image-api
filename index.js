const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const responseTime = require('response-time');
const helmet = require('helmet');
const path = require('path');

const logger = require('./libs/logger')('server');
const errorHandler = require('./middleware/errors/error-handler');

const app = express();
app.use(cors({
  origin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
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

app.use(`${apiPrefix}/auth`, require('./routes/auth.routes'))
app.use(`${apiPrefix}/users`, require('./routes/user.routes'));
app.use(`${apiPrefix}/groups`, require('./routes/group.routes'));
app.use(`${apiPrefix}/images`, require('./routes/images.routes'));
app.use(`${apiPrefix}/uploads`, require('./routes/uploads.routes'));

app.use(express.static('public'));
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
const certDir = process.env.CERT_DIR;

const credentials = {
  key: fs.readFileSync(`${certDir}/privkey.pem`),
  cert: fs.readFileSync(`${certDir}/fullchain.pem`)
};

const server = https.createServer(credentials, app);
server.listen(port, () => {
  logger.info(`server listening on port ${port}`);
});
