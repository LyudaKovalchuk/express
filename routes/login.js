const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../schemas/users');
const alreadyLogginCheck = require('../middlewares/login-check/login-redirect');

router.post('/login', alreadyLogginCheck, (req, resp, next) =>  {
    const { email, pass } = req.body;

    User.findOne({email}).exec().then((user) => {
        if (!user) {
            resp.status(400).send(resp.json('User not found'));
            return;
        }
        bcrypt.compare(pass, user.pass).then((result) => {
            if (result === true) {
                req.session.user = user;
                resp.status(200).send(resp.json( user));
                return;
            }
            resp.status(401).send(resp.json('Invalid credentials'));
        });
    }).catch(err => next(err));
});

module.exports = router;
