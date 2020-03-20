var express = require('express');
var router = express.Router();

var User = require('../schemas/users');


router.post('/register', function(req, resp) {
    console.log(req.body);
    const { name, email, pass } = req.body;
    const user = new User({name, email, pass});
    user.save((err)=> {
        if (err) {
            resp.status(500).send("Error registering new user please try again.")
        } else {
            resp.status(200).send("Welcome to the club")
        }
    })
})

module.exports = router;
