const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');

const moment = require('moment');

const app = express();

// Database
const db = require('./db/config');

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

/**
 * Count ad clicks
 */
app.get('/count', (req, res, next) => {
  let logItem = JSON.stringify({ referer: req.headers.referer, ip: req.ip, time: moment().format('MMMM Do YYYY, h:mm:ss a') });
  db.lpush(`log:${req.query.dest}`, logItem, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.redirect(req.query.dest);
  });
});

/**
 * Get the next ad in the queue
 */
app.get('/next', (req, res, next) => {
  db.rpoplpush('ads', 'ads', (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (!result) result = JSON.stringify({});
    res.send(result);
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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

// Start server
let port = process.env.NODE_ENV === 'production' ? 3000 : 3001; 
app.listen(port, '0.0.0.0', () => {
  console.log('ad-tracker listening on ' + port + '!');
});

module.exports = app;
