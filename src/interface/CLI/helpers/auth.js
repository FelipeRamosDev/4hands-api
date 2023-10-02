const FS = require('@services/FS');
const config = require('@config');
const sessionCLI = FS.isExist(config.sessionPath) && require('@SESSION_CLI') || {};

/**
 * Checks if the provided token corresponds to an active authenticated session.
 * @function
 * @async
 * @param {string} token - The token to be authenticated.
 * @returns {boolean} - True if the token is valid and corresponds to an active session, false otherwise.
 * @throws {Error} - Throws an error if there is an issue with the authentication process.
 */
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

/**
 * Creates or updates a user's session in the command-line interface (CLI) environment.
 * @function
 * @async
 * @param {Object} user - The user object containing session-related information.
 * @returns {Object} - An object indicating the success or failure of the session creation/update process.
 * @throws {Error} - Throws an error if there is an issue creating or updating the user's session.
 */
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

/**
 * Retrieves the current user ID from the CLI session.
 * @function
 * @returns {string|undefined} - The ID of the current user if available, undefined otherwise.
 * @throws {Error} - Throws an error if there is an issue retrieving the current user ID.
 */
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
