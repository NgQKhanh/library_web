exports.RFIDLoggedin = (req, res, next) => {
    if (req.session.loggedin) {
        res.locals.user = req.session.user;
        next();
    } else {
        res.redirect('/RFIDLogin')
    }
}

exports.isRFIDAuth = (req, res, next) => {
    if (req.session.loggedin) {
        res.locals.user = req.session.user;
        res.redirect('/RFIDHome');
    } else {
        next();
    }
}

exports.isAdminAuth = (req, res, next) => {
    if (req.session.loggedin) {
        res.locals.user = req.session.user;
        res.redirect('/adminHome');
    } else {
        next();
    }
}

exports.adminLoggedin = (req, res, next) => {
    if (req.session.userLoggedin) {
        res.locals.user = req.session.user;
        next();
    } else {
        res.redirect('/adminLogin')
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
