const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const responseTime = require('response-time');
const helmet = require('helmet');

const authController = require('./controllers/auth.controller');
const userController = require('./controllers/user.controller');
const uploadController = require('./controllers/upload.controller');
const imageController = require('./controllers/image.controller');

const {
  BasicAuthHeader,
  BearerAuthHeader,
  NewUserData,
  UserData,
  QueryCommon,
  UserExists,
  UserCanDoEverything,
  UserCanViewProfile,
  UserCanEditProfile,
  UserCanViewImage,
  UserCanEditImage,
} = require('./middleware/validation/schemas');
const check = require('./middleware/validation/check');

const { Regex } = require('./enum');

const logger = require('./libs/logger')('server');
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

app.get(`/api/auth`, check(BasicAuthHeader), authController.getIdToken);
app.get(`api/auth/verify-token`, check(BearerAuthHeader), authController.verifyIdToken);
app.get(`/api/images/:filename`, check(UserCanViewImage), imageController.sendImage);
app.post('/api/upload', check(UserExists, ImageData), uploadController, (req, res, next) => {
  res.status(201).json(req.files);
});
app.patch(`/api/images/:filename`, check(UserCanEditImage, ImageData), imageController.updateImage);

app.get(`/api/users`, check(UserCanDoEverything, QueryCommon), userController.getUsers);
app.get(`/api/users/:userId(${Regex.positiveInt})`, check(UserCanViewProfile), userController.getUser);
app.post(`/api/users`, check(NewUserData), userController.createUser);
app.patch(`/api/users/:userId(${Regex.positiveInt})`,
  check(UserCanEditProfile, UserData), userController.updateUser);
app.delete(`/api/users/:userId(${Regex.positiveInt})`, check(UserCanEditProfile), userController.removeUser);

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
