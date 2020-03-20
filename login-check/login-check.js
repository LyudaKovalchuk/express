function loggedInCheck(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        var err = new Error("Not logged in!");
        console.log(req.session.loggedIn);
        next(err);  //Error, trying to access unauthorized page!
    }
}

module.exports = loggedInCheck;
