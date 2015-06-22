var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mergeJs = require('merge-js');
var fs = require('fs');
var busboy = require('connect-busboy');

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
app.use(busboy({limits: {fileSize: 512 * 1024}}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.get('/upload', function (req, res, next) {
  res.redirect('/');
});

app.post('/upload', function (req, res, next) {
var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    if (fieldname == 'avatar' && filename.lastIndexOf('.png') == filename.length - 4) {
      var outfile = path.join(__dirname, 'public', 'img', 'skins', filename);
      fs.stat(outfile, function (err, stats) {
        if (err && err.code == 'ENOENT') {
          fstream = fs.createWriteStream(outfile);
          file.pipe(fstream);
          fstream.on('close', function () {
            if (file.truncated) {
              fs.unlink(outfile, function (err) {
                if (err) throw err;
                res.redirect('/?uploaderr=toobig');
              });
            } else {
              res.redirect('/?name=' + filename.substr(0, filename.length - 4));
            }
          });
        } else {
          res.redirect('/?uploaderr=exists');
        }
      });
    } else {
      res.redirect('/?uploaderr=unknown');
    }
  });
});

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
