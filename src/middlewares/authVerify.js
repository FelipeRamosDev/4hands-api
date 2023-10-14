module.exports = async (req, res, next) => {
    const { session, sessionStore, headers } = req;

    sessionStore.get(headers.token, (err, data) => {
        if (err || !data || !data.isAuthorized) {
            if (!data) {
                delete req.session.currentUser;
                delete req.session.user;
                delete req.session.isAuthorized;
            }

            return res.status(401).send({
                name: 'USER_NOT_AUTHORIZED',
                message: 'The user is not authorized for this endpoint!'
            });
        } else {
            session.user = data.user;
            session.isAuthorized = data.isAuthorized;

            return next();
        }
    });

}
