module.exports = async (req, res, next) => {
    if (!req.session.currentUser) {
        res.setHeader('Content-Type', 'text/html');
        return res.redirect('/user/signin');
    } else {
        return next();
    }
}
