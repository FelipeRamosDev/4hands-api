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
    if (req.session.userId) {
        return next();
    }

    const legacySessionID = req.cookies?.legacy_session_id;

    if (!legacySessionID || !req.sessionStore?.get) {
        return res.status(401).send(notAuthorizedError);
    }

    req.sessionStore.get(legacySessionID, (err, data) => {
        if (err || !data) {
            return res.status(401).send(notAuthorizedError);
        }

        const userId = data.userId || data.user?._id || data.user?.id;

        if (!userId) {
            return res.status(401).send(notAuthorizedError);
        }

        req.sessionID = legacySessionID;
        req.session.userId = userId;
        req.session.user = data.user;
        req.session.isAuthorized = data.isAuthorized;
        req.session.isEmailConfirmed = data.isEmailConfirmed;

        return next();
    });
}
