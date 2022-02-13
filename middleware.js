module.exports.isLoggedIn = (req, res, next) => {
    // console.log("REQ.USER...", req.user);  //undefined if ! req.user
    if (!req.isAuthenticated()) {
        // console.log(req.path, req.originalUrl); // /new  and  /campgrounds/new
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');

    }
    next();
}