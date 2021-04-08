const passport = require('passport');

module.exports = {

  renderLoginForm(req, res) {
    res.render('login');
  },
  
  login(req, res, next) {
    passport.authenticate('local', {
      failureRedirect: '/sad-face',
      successRedirect: '/',
    })(req, res, next);
  },

  logout(req, res) {
    req.logout();
    res.redirect('/sad-face');
  },

};
