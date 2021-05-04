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

baseRouter.get('/',
  (req, res) => {
    if (req.session.viewCount) {
      req.session.viewCount += 1;
    } else {
      req.session.viewCount = 1;
    }
    if (req.isAuthenticated()) {
      res.render('home', {
        user: req.user,
        images: new Array(20).fill({
          filename: 'liczniki.jpg',
        }),
        viewCount: req.session.viewCount,
      });
    } else {
      res.redirect('/login');
    }
  }
);
baseRouter.get('/login', 
  (req, res) => {
    res.render('index', {
      user: null,
      form: {
        action: '/login',
        submitValue: 'Zaloguj',
      },
      view: {
        name: 'form',
        title: 'Zaloguj się',
      },
      viewSwitch: {
        link: '/add-account',
        title: 'Nowe konto',
        icon: 'icon-user-plus'
      },
      viewCount: req.session.viewCount,
    });
  }
);
baseRouter.post(`/login`, authLimiter, authController.login);
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
baseRouter.get('/logout', authController.logout);
baseRouter.get('/add-account',
  (req, res) => {
    res.render('index', {
      form: {
        action: `${apiPrefix}/users`,
        submitValue: 'Utwórz konto',
      },
      view: {
        name: 'form',
        title: 'Nowe konto',
      },
      viewSwitch: {
        link: '/login',
        title: 'Zaloguj się',
        icon: 'icon-sign-in'
      },
      viewCount: req.session.viewCount
    });
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
