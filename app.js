const config = require('./config/config');
const path = require('path');
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// added for auth0
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

// routes.  encapsulate this
const indexRouter = require('./routes/index');
const workRouter = require('./routes/work');
const aboutRouter = require('./routes/about');
const tatRouter = require('./routes/tattoos');
const blogRouter = require('./routes/blog');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.moment = require('moment');
app.locals.Page = require('./models/Page');

// auth0
const strategy = new Auth0Strategy(
  {
    domain: config.auth.domain,
    clientID: config.auth.clientID,
    clientSecret: config.auth.clientSecret,
    callbackURL: config.auth.callbackURL
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

passport.use(strategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: 'sanguinus-picti-secret',
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


//**********ROUTES */

// Check logged in
app.use(function(req, res, next) {
  res.locals.loggedIn = false;
  if (req.session.passport && typeof req.session.passport.user != 'undefined') {
    res.locals.loggedIn = true;
  }
  next();
});

app.use('/', indexRouter.router);
app.use('/work', workRouter.router);
app.use('/about', aboutRouter.router);
app.use('/tattoos', tatRouter.router);
app.use('/blog', blogRouter.router);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('./layouts/error.pug');
});

app.listen(3001, 'localhost');
console.log('App listening on localhost:3001...');

module.exports = app;
