function loggedInCheck(req, res, next) {
    if (req.session.user) {
        next();
        return;
    }
    res.status(401).send('User unauthorized!')
}

module.exports = loggedInCheck;
