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
  BasicAuthHeader,
  NewUserData,
  UserData,
  QueryCommon,
  UserExists,
  UserCanDoEverything,
  UserCanViewProfile,
  UserCanEditProfile,
  UserCanAddImages,
  UserCanViewImage,
  UserCanEditImage,
} = require('./middleware/validation/schemas');
const validate = require('./middleware/validation/validate');

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

app.get(`/api/auth`, validate(BasicAuthHeader), auth.getIdToken);
app.get(`/api/images/:filename`, validate(UserCanViewImage), images.sendImage);
app.post('/api/upload', validate(UserExists, ImageData), upload, (req, res, next) => {
  res.status(201).json(req.files);
});

app.get(`/api/users`, validate(UserCanDoEverything, QueryCommon), users.getUsers);
app.get(`/api/users/:userId(${Regex.positiveInt})`, validate(UserCanViewProfile), users.getUser);
app.post(`/api/users`, validate(NewUserData), users.createUser);
app.patch(`/api/users/:userId(${Regex.positiveInt})`,
  validate(UserCanEditProfile, UserData), users.updateUser);
app.delete(`/api/users/:userId(${Regex.positiveInt})`, validate(UserCanEditProfile), users.removeUser);

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
