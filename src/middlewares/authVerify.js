const AuthService = require('4hands-api/src/services/Auth');

const notAuthorizedError = {
    name: 'USER_NOT_AUTHORIZED',
    message: 'The user is not authorized for this endpoint!'
};

const notConfirmedEmail = {
    name: 'USER_EMAIL_NOT_CONFIRMED',
    message: `The user's e-mail is not confirmed!`
};

module.exports = async (req, res, next) => {
    const { session, sessionStore, headers, body } = req;
    const authService = new AuthService();

    if (!headers.token || headers.token === 'undefined') {
        return res.status(401).send(notAuthorizedError);
    }

    const tokenData = authService.validateToken(headers.token);
    if (!tokenData) {
        return res.status(401).send(notAuthorizedError);
    }

    sessionStore.get(tokenData.sessionID, (err, data) => {
        if (err || !data || !data.isAuthorized) {
            if (!data) {
                delete req.session.user;
                delete req.session.isAuthorized;
                delete req.session.sessionSalt;
            }

            return res.status(401).send(notAuthorizedError);
        } else {
            if (!data.isEmailConfirmed) {
                if (typeof body.confirmationtoken !== 'string') {
                    const error = toError(notConfirmedEmail);
                    return res.status(201).send({ ...error, userName: data.user?.email });
                }
                
                session.confirmationToken = data.confirmationToken;
            }

            session.user = data.user;
            session.isAuthorized = data.isAuthorized;
            session.sessionSalt = data.sessionSalt;
            req.sessionID = tokenData.sessionID;

            return next();
        }
    });
}
