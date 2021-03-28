const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../model');

const verifyCallback = (username, password, done) => {
  User.findOne({ where: { username }})
    .then(user => {
      if (user && user.isCorrectPassword(password)) {
        console.log(user);
        return done(null, user);
      } else {
        console.log('incorrect username or password');
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
      done(null, user);
    })
    .catch(done);
});
