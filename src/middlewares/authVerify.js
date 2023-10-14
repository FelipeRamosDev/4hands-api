const AuthService = require('@services/Auth');

module.exports = async (req, res, next) => {
    const { session, sessionStore, headers } = req;
    const authService = new AuthService();
    const notAuthorixedError = {
        name: 'USER_NOT_AUTHORIZED',
        message: 'The user is not authorized for this endpoint!'
    };
    
    if (!headers.token) {
        return res.status(401).send(notAuthorixedError);
    }

    const tokenData = authService.validateToken(headers.token);
    if (!tokenData) {
        return res.status(401).send(notAuthorixedError);
    }

    sessionStore.get(tokenData.sessionID, (err, data) => {
        if (err || !data || !data.isAuthorized) {
            if (!data) {
                delete req.session.user;
                delete req.session.isAuthorized;
                delete req.session.sessionSalt;
            }

            return res.status(401).send(notAuthorixedError);
        } else {
            session.user = data.user;
            session.isAuthorized = data.isAuthorized;
            session.sessionSalt = data.sessionSalt;

            return next();
        }
    });

}
