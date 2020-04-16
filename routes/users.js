const express = require('express');
const router = express.Router();

const User = require('../schemas/users');
const ObjectId = require('mongodb').ObjectId;
const HttpError = require('../error/index').HttpError;

router.get('/users', function (req, res, next) {
  User.find({}, function (error, users) {
    res.json(users);
  }, function () {

  })
});

router.get('/users/:id', function (req, res, next) {
  if(req.session.page_views){
    req.session.page_views++;
    // res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.page_views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    // res.end()
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
      res.write(`<p>${user.name}</p>`)
    }

  })

  res.end();
});

module.exports = router;
