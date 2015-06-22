var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mergeJs = require('merge-js');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/* variables */
app.locals.regions = [{val: 'US-Fremont', name: 'US West'},
  {val: 'US-Atlanta', name: 'US East'},
  {val: 'BR-Brazil', name: 'South America'},
  {val: 'EU-London', name: 'Europe'},
  {val: 'RU-Russia', name: 'Russia'},
  {val: 'TK-Turkey', name: 'Turkey'},
  {val: 'JP-Tokyo', name: 'East Asia'},
  {val: 'CN-China', name: 'China'},
  {val: 'SG-Singapore', name: 'Oceania'}];

app.locals.modes = [{val: '', name: 'FFA'},
  {val: ':teams', name: 'Teams'},
  {val: ':experimental', name: 'Experimental'}];

// uncomment to display links at the bottom of the login page
//app.locals.links = [{val: 'tos.html', name: 'Terms of Service'}, {val: '#', name: 'Another link...'}];

// uncomment to use a banner
//app.locals.banner = '/img/banner.png';

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(mergeJs.middleware({
  src: path.join(__dirname, 'src', 'client'),
  dest: path.join(__dirname, 'public'),
  // only concatenate during development
  uglify: app.get('env') !== 'development',
  mangle: app.get('env') !== 'development',
  squeeze: app.get('env') !== 'development'
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
