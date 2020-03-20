var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

var User = require('../schemas/users');

router.post('/login', function (req, resp) {
    const { email, pass } = req.body;
    console.log(email, pass);

    User.findOne({email}).exec(function (error, user) {
        if (error) {
            resp.status(401).send('User not found')
        } else {
            console.log(user);
            bcrypt.compare(pass, user.pass, function (err, result) {
                if (err) {
                    resp.status(401).send('Error');
                } else {
                    if (result === true) {
                        req.session.loggedIn = true;
                        console.log(result);
                        resp.status(200).send('Successfully loggedIn');
                    } else {
                        resp.status(401).send('Invalid credentials');
                    }

                }
            })
        }

    })
});

module.exports = router;
