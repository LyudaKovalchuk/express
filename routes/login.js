const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../schemas/users');
const alreadyLogginCheck = require('../login-check/login-redirect');

router.post('/login', alreadyLogginCheck, (req, resp) =>  {
    const { email, pass } = req.body;

    User.findOne({email}).exec().then((user) => {
        if (!user) {
            resp.status(401).send('User not found');
            return;
        }
        bcrypt.compare(pass, user.pass).then((result) => {
            if (result === true) {
                req.session.user = user;
                resp.status(200).send('Successfully loggedIn');
                return;
            }
            resp.status(401).send('Invalid credentials');
        });
    }).catch(err => console.log(err));
});

module.exports = router;
