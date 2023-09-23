const FS = require('@services/FS');
const config = require('@config');
const sessionCLI = FS.isExist(config.sessionPath) && require('@SESSION_CLI') || {};

async function isAuthenticated(token) {
    try {
        const isSessionExist = FS.isExist(config.sessionPath);
        if (!isSessionExist) {
            return false;
        }

        const session = require('@SESSION_CLI');
        const sessionObj = Object.entries(session).find(([key, value]) => session[key] && value.token === token);

        if (!sessionObj) {
            return false;
        }

        if (sessionObj[1].expiration < Date.now()) {
            return false;
        }

        return true;
    } catch (err) {
        throw new Error.Log(err);
    }
}

async function createUserCLISession(user) {
    try {
        let session = {};
        const sessionPath = config.sessionPath;

        if (FS.isExist(sessionPath)) {
            session = require('@SESSION_CLI');
        }

        const token = user.token;
        session.currentUser = user._id;
        session[user._id] = {
            token,
            gitHubToken: user && user.getSafe('auth._gitHubToken').toString(),
            expiration: Date.now() + 86400000
        }

        const sessionCreated = await FS.writeJSON(sessionPath, session);
        if (sessionCreated instanceof Error.Log) {
            throw sessionCreated;
        }

        if (sessionCreated.success) {
            return sessionCreated;
        } else {
            throw sessionCreated;
        }
    } catch (err) {
        throw new Error.Log(err);
    }
}

function getSessionCurrentUser() {
    try {
        return sessionCLI && sessionCLI.currentUser;
    } catch (err) {
        throw new Error.Log(err);
    }
}

module.exports = {
    isAuthenticated,
    createUserCLISession,
    getSessionCurrentUser
};
