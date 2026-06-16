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
                    const user = data.user;
                    const fullName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ');
                    return res.status(201).send({ ...notConfirmedEmail, isLogged: true, user: { ...user, fullName }, userName: user?.email });
                }
            }

            const ghostSessionID = req.sessionID;
            req.sessionID = tokenData.sessionID;

            // Rebuild req.session with session.id = Session A (the real session).
            // createSession() creates new Session(req, data), which sets session.id = req.sessionID.
            // This ensures express-session's auto-save at response end writes to Session A, not Session B.
            sessionStore.createSession(req, data);

            // Destroy the ghost Session B to prevent accumulation in the store.
            if (ghostSessionID !== tokenData.sessionID) {
                sessionStore.destroy(ghostSessionID, (destroyErr) => {
                    if (destroyErr) console.error('[authVerify] Failed to destroy ghost session:', destroyErr);
                });
            }

            return next();
        }
    });
}
