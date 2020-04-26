function alreadyLoggedInCheck(req, res, next) {
    if (req.session.user) {
        res.redirect('/home');
        return;
    }
    next();
}

module.exports = alreadyLoggedInCheck;
