const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const responseTime = require('response-time');
const helmet = require('helmet');

const upload = require('./middleware/upload');

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.get(`/api/auth`, authController.getIdToken);
app.get(`/api/auth/verify-token`, authController.verifyIdToken);

app.get(`/api/users`, check(QueryCommon), verifyAdmin, userController.getUsers);
app.get(`/api/users/:userId(${Regex.positiveInt})`, verifyAdmin, userController.getUser);
app.post(`/api/users`, check(NewUserData), userController.createUser);
app.patch(`/api/users/:userId(${Regex.positiveInt})`,
  check(UserData), verifyAdmin, userController.updateUser);
app.delete(`/api/users/:userId(${Regex.positiveInt})`, verifyAdmin, userController.removeUser);

app.get(`/api/images`, check(QueryCommon), verifyAdmin, imageController.getImages);
app.get(`/api/images/:filename`, verifyAdmin, imageController.getImage);
app.post('/api/images', check(NewImageData), verifyUser, imageController.createImage);
app.patch(`/api/images/:filename`, check(ImageData), verifyAdmin, imageController.updateImage);
app.delete(`/api/images/:filename`, verifyAdmin, imageController.removeImage);

app.get(`/api/uploads/:filename`, verifyUser, uploadController.getFile);
app.get(`/api/uploads/thumbnails/:filename`, verifyUser, uploadController.getThumbnail);
app.post(`/api/uploads`, verifyUser, upload.single, uploadController.createImage);
app.delete(`/api/uploads/:filename`, verifyAdmin, uploadController.removeImage);

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
