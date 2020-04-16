var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
const mongoose = require('mongoose');
const loggedInCheck = require('./login-check/login-check');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

var db = mongoose.connection;
var HttpError = require('./error/index').HttpError;
console.log(HttpError);
db.once('open', function (error) {
  if (error) {
    console.log('Eror');
  } else {
    console.log('Conection established!!!');
  }
})
db.on('error', function (err) {
  console.log(err);
})

var app = express();
app.use(cors());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: 'vfdfjvnjd',
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {
    httpOnly: true
}
}))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(require('./routes/users'));
app.get('/securedPage', loggedInCheck, function (req, resp) {
  console.log(resp);
  resp.send('On secured Page!')
})

app.use(require('./routes/auth'));
app.use(require('./routes/login'));
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
  res.render('error');
});

module.exports = app;
