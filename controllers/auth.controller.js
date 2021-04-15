const passport = require('passport');

module.exports = {
  login(req, res, next) {
    passport.authenticate('local', {
      failureRedirect: '/sad-face',
      successRedirect: '/',
    })(req, res, next);
  },
  
  logout(req, res) {
    req.logout();
    res.redirect('/');
  },
};
