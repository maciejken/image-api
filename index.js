const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const responseTime = require("response-time");
const helmet = require("helmet");

const auth = require('./controllers/auth.controller');
const users = require('./controllers/users.controller');
const upload = require('./controllers/upload.controller');
const images = require('./controllers/images.controller');

const {
  BodyIsUser,
  QueryCommon,
  validate
} = require('./middleware/validation');

const { Regex } = require('./enum');

const logger = require("./libs/logger")("server");
const { errorHandler } = require('./middleware/errors');

const app = express();
app.use(cors({ origin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN }));
app.use(bodyParser.json());
app.use(helmet());
app.use(responseTime());

const logRequestStart = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}, client IP ${req.ip}`);
  next()
};
app.use(logRequestStart);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.get(`/api/auth`, auth.getIdToken);
app.get(`/api/images/:filename`, images.sendData);
app.post('/api/upload', upload, (req, res, next) => {
  res.status(201).json(req.files);
});

app.get(`/api/users`, validate(QueryCommon), auth.allowAdmin, users.getUsers);
app.get(`/api/users/:id(${Regex.positiveInt})`, auth.allowUser, users.getUser);
app.post(`/api/users`, validate(BodyIsUser), users.createUser);
app.put(`/api/users/:id(${Regex.positiveInt})`, validate(BodyIsUser),
  auth.allowUser, users.updateUser);
app.delete(`/api/users/:id(${Regex.positiveInt})`, auth.allowUser, users.removeUser);

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
