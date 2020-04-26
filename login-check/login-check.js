function loggedInCheck(req, res, next) {
    if (req.session.user) {
        next();
        return;
    }
        var err = new Error("Not logged in!");
        next(err);  //Error, trying to access unauthorized page!
}

module.exports = loggedInCheck;
