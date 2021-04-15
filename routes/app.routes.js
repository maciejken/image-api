const express = require('express');
const baseRouter = express.Router();
const rateLimit = require('express-rate-limit');
const logger = require('../libs/logger')('routes');

const { apiPrefix } = require('../config');
logger.debug(`API prefix is "${apiPrefix}"`);

const authController = require('../controllers/auth.controller');

const authLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX)
});

baseRouter.post(`/login`, authLimiter, authController.login);
baseRouter.get('/logout', authController.logout);
baseRouter.get('/sad-face', 
  (req, res) => {
    res.render('index', {
      view: {
        title: 'Błąd logowania',
        name: 'error'
      }
    });
  }
);
baseRouter.get('/',
  (req, res) => {
    if (req.session.viewCount) {
      req.session.viewCount += 1;
    } else {
      req.session.viewCount = 1;
    }
    if (req.isAuthenticated()) {
      res.render('index', {
        user: req.user,
        images: new Array(20).fill({
          filename: 'liczniki.jpg',
        }),
        view: {
          name: 'home',
          title: 'Strona główna',
        },
        viewCount: req.session.viewCount,
      });
    } else {
      res.render('index', {
        user: null,
        form: {
          action: '/login',
          submitValue: 'Zaloguj',
        },
        view: {
          name: 'home',
          title: 'Zaloguj się',
        },
        viewCount: req.session.viewCount,
      });
    }
  }
);

function addRoutes(app) {
  app.use(`${apiPrefix}/users`, require('./user.routes'));
  app.use(`${apiPrefix}/groups`, require('./group.routes'));
  app.use(`${apiPrefix}/images`, require('./images.routes'));
  app.use(`${apiPrefix}/uploads`, require('./uploads.routes'));
  app.use(`${apiPrefix}/cv`, require('./cv.routes'));
  app.use(`${apiPrefix}/experiences`, require('./experience.routes'));
  app.use('/', baseRouter);
}

module.exports = addRoutes;
