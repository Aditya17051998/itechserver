const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authenticationCtrl = require('../controllers/authentication/index');

passport.use('login', new LocalStrategy({
  passReqToCallback: true,
  usernameField: 'email'
}, ((req, email, password, done) => {
  authenticationCtrl.signIn({ email: email, password: password })
    .then((user) => {
      console.log("auth done")
      req.user = user;
      done(null, user);
    }).catch((err) => {
      done(err);
    });
})));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
