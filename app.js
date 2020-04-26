const createError = require('http-errors');
const express = require('express');

const cookieParser = require('cookie-parser');
const cors = require('cors');

const logger = require('morgan');

const loggedInCheck = require('./login-check/login-check');
const session = require('express-session');
const config = require('.//config/default');

const users = require('./routes/users');
const auth = require('./routes/auth');
const login = require('./routes/login');



function createApp(mongooseConnection) {
  var app = express();
  app.use(cors());

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  const MongoStore = require('connect-mongo')(session);
  app.use(session({
    secret: config.Session.Secret,
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({mongooseConnection}),
    cookie: {
      httpOnly: config.Session.httpOnly
    }
  }));


  app.use(users);
  app.get('/securedPage', loggedInCheck, (req, resp) => resp.send('On secured Page!'));
  app.use(auth);
  app.use(login);

// catch 404 and forward to error handler
  app.use((req, res, next) => next(createError(404)));

// error handler
  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  return app;

}

module.exports = createApp;
