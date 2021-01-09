function alreadyLoggedInCheck(req, res, next) {
    if (req.session.user) {
        res.redirect('/');
        return;
    }
    next();
}

module.exports = alreadyLoggedInCheck;
