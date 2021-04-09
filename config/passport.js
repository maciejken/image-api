const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User, Group } = require('../model');

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

passport.deserializeUser(function(id, done) {
  User.findOne({ where: { id }, include: Group })
    .then(user => {
      const { username, groups, createdAt, updatedAt } = user;
      const userData = { id, username, groups, createdAt, updatedAt };
      done(null, userData);
    })
    .catch(done);
});
