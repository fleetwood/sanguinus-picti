const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter.router);
app.use('/work', workRouter.router);
app.use('/about', aboutRouter.router);
app.use('/tattoos', tatRouter.router);
app.use('/blog', blogRouter.router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
