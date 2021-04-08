const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../model');

const verifyCallback = (username, password, done) => {
  User.findOne({ where: { username }})
    .then(user => {
      if (user && user.isCorrectPassword(password)) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch(done);
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(userId, done) {
  User.findByPk(userId)
    .then(user => {
      const { id, username, createdAt, updatedAt } = user.dataValues;
      const userData = { id, username, createdAt, updatedAt };
      done(null, userData);
    })
    .catch(done);
});
