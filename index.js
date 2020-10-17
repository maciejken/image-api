const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const responseTime = require('response-time');
const helmet = require('helmet');
const path = require('path');

const upload = require('./middleware/upload');
const uploadField = process.env.IMAGE_UPLOAD_FIELD_NAME;
const thumbnail = require('./middleware/thumbnail');

const authController = require('./controllers/auth.controller');
const userController = require('./controllers/user.controller');
const imageController = require('./controllers/image.controller');
const uploadController = require('./controllers/upload.controller');

const {
  NewUserData,
  UserData,
  QueryCommon,
  NewImageData,
  ImageData,
} = require('./middleware/validation/schemas');
const check = require('./middleware/validation/check');

const { verifyUser, verifyAdmin } = require('./middleware/auth');

const { Regex } = require('./enum');

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

const authLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX)
});

const apiPrefix = process.env.API_PREFIX;
app.get(`${apiPrefix}/auth`, authLimiter, authController.getIdToken);
app.get(`${apiPrefix}/auth/verify-token`, authController.verifyIdToken);

app.get(`${apiPrefix}/users`, check(QueryCommon), verifyAdmin, userController.getUsers);
app.get(`${apiPrefix}/users/:userId(${Regex.positiveInt})`, verifyAdmin, userController.getUser);
app.post(`${apiPrefix}/users`, check(NewUserData), userController.createUser);
app.patch(`${apiPrefix}/users/:userId(${Regex.positiveInt})`,
  check(UserData), verifyAdmin, userController.updateUser);
app.delete(`${apiPrefix}/users/:userId(${Regex.positiveInt})`, verifyAdmin, userController.removeUser);

app.get(`${apiPrefix}/images`, check(QueryCommon), verifyAdmin, imageController.getImages);
app.get(`${apiPrefix}/images/:filename`, verifyAdmin, imageController.getImage);
app.post(`${apiPrefix}/images`, check(NewImageData), verifyUser, imageController.createImage);
app.patch(`${apiPrefix}/images/:filename`, check(ImageData), verifyAdmin, imageController.updateImage);
app.delete(`${apiPrefix}/images/:filename`, verifyAdmin, imageController.removeImage);

app.get(`${apiPrefix}/uploads/:filename`, verifyUser, uploadController.getMediumSizeImage);
app.get(`${apiPrefix}/uploads/:filename/thumbnail`, verifyUser, uploadController.getThumbnail);
app.get(`${apiPrefix}/uploads/:filename/full-size`, verifyUser, uploadController.getFullSizeImage);
app.post(`${apiPrefix}/uploads`, verifyUser, upload.array(uploadField), thumbnail, uploadController.createImages);
app.delete(`${apiPrefix}/uploads/:filename`, verifyAdmin, uploadController.removeImage);

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
