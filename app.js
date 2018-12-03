var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');
var ObjectId = require('mongodb').ObjectId;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const mongoose = require('mongoose');
var async = require('async');
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

var Article = require('./schemas/article');
var article = new Article({
  title: 'Test',
  author: 'Test author'
});

article.save(function (error) {
  console.log('saved');
  if (error) {
    console.log(error);
  }
});

var User = require('./schemas/users');
const users = [
  { name: 'Lyuda', age: 22 },
  { name: 'Misha', age: 21 }
];
async.each(users, function (userItem) {
  console.log(userItem);
  let user = new User(userItem);
  user.save(function () {
    console.log(`user ${user.name} saved!`);
  })
})

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
  store: new MongoStore({mongooseConnection: mongoose.connection})
}))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.get('/users', function (req, res, next) {
  User.find({}, function (error, users) {
    res.json(users);
  }, function () {
    
  })
});
app.get('/users/:id', function (req, res, next) {
  if(req.session.page_views){
    req.session.page_views++;
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.page_views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.page_views = 1;
    res.end("Welcome to this page for the first time!");
  }
  try {
    var id = new ObjectId(req.params.id);
    console.log(id);
  } catch (e) {
    return next(new HttpError(404, 'User not found111'));
  }


  User.findById(id, function (error, user) {
    if (!user) {
      next(new HttpError(404, 'Objecy ID'));
    } else {
      res.json(user);
    }

  })
})
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
