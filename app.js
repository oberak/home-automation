var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/home-automation';

var index = require('./routes/index');
var users = require('./routes/users');
var commons = require('./routes/commons');

var app = express();

var session = require('express-session');
app.use(session({
      secret : 'h0M@A<weAre>T0WV0!a#&',
      resave: false,
      saveUninitialized : true

}));

app.use(function (req, res, next) {
        res.locals.user = req.session.user;
        next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/commons',commons);

mongoose.connect(mongoDB, {
    useMongoClient: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console,'mongoDB connection error:'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('404 file Not Found');
  err.status = 404;
  res.status(err.status);
  res.render('commons/err-404', { title: '404 Page Not found', error: err });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('commons/err-500', { title: '500 Internal Server Error', error: err });
});

module.exports = app;
