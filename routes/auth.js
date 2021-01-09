var express = require('express');
var router = express.Router();

var User = require('../schemas/users');


router.post('/register', function(req, resp) {
    const {email, pass, roles } = req.body;
    const user = new User({email, pass, roles});
    user.save((err)=> {
        if (err) {
            resp.status(500).send(`Error registering new user. ${err.message}`);
            return;
        }
        resp.status(200).send("Welcome to the club");
    })
});

module.exports = router;
