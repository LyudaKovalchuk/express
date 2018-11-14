var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

var db = mongoose.connection;

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

var Article = require('./createDb');
var article = new Article({
  title: 'Test',
  author: 'Test author'
});

article.save(function (error) {
  console.log('saved');
  if (error) {
    console.log(error);
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/article', function (req, res) {
  Article.find({}, function (error, articles) {
    if (error) {
      console.log(error);
    } else {
      res.render('index', {
        title: 'Articles',
        articles: articles
      })
    }
  })
})

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
