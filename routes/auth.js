const config = require('../config/config');
const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/login', 
  passport.authenticate('auth0', {
    clientID: config.auth.clientID,
    domain: config.auth.domain,
    redirectUri: config.callbackURL,
    responseType: 'code',
    audience: `https://${config.auth.domain}/userinfo`,
    scope: 'openid profile'}),
  (req, res) => res.redirect("/"));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/failure'
  }),
  (req, res) => res.redirect(req.session.returnTo || '/user'));

router.get('/failure', (req, res) => {
  var error = req.flash("error");
  var error_description = req.flash("error_description");
  req.logout();
  res.render('failure', {
    error: error[0],
    error_description: error_description[0],
  });
});

module.exports = router;
