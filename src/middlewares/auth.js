exports.loggedin = (req, res, next) => {
    if (req.session.loggedin) {
        res.locals.user = req.session.user;
        next();
    } else {
        res.redirect('/RFIDLogin')
    }
}

exports.isAuth = (req, res, next) => {
    if (req.session.loggedin) {
        res.locals.user = req.session.user;
        res.redirect('/home');
    } else {
        next();
    }
}

exports.userLoggedin = (req, res, next) => {
    if (req.session.userLoggedin) {
        res.locals.user = req.session.user;
        next();
    } else {
        res.redirect('/login')
    }
}

exports.isUserAuth = (req, res, next) => {
    if (req.session.userLoggedin) {
        res.locals.userInfo = req.session.userInfo;
        res.redirect('/userPage');
    } else {
        next();
    }
}