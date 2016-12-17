/*\
|*|  @title    app.js
|*|  @author   Alden J. Curnutt
|*|  @site     FMP
|*|  @ver      0.0.0
|*|  @updated  17 August 2016
|*|
\*/


/*\
|*|  Require node modules
\*/
var express = require('express');
var config = require('./config')
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


/*\
|*|  Initializing mongodb connection
\*/
// mongoose.connect('mongodb://localhost:27017/fmp-' + config.env);


/*\
|*|  Initializing express server
\*/
var app = express();


/*\
|*|  Initializing node modules
\*/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*\
|*|  Catch 404 and forward to error handler
\*/
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


/*\
|*|  Development error handler, prints stacktrace
\*/
if ( config.env === 'development' ) {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

 
/*\
|*|  Production error handler, does not print stacktraces
\*/
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;