const User = require('4hands-api/src/models/collections/User');
const AuthBucket = require('4hands-api/src/models/collections/AuthBucket');

class UsersClass {
    static Model = User;

    /**
     * Gets the AuthService instance associated with this user.
     * @returns {AuthService} - The AuthService instance.
     */
    get authService() {
        if (this.auth) {
            const auth = this.auth.initialize();
            return auth.service;
        }
    }

    async signUp() {
        try {
            if (this.isNew) {
                const auth = await AuthBucket.draft(this);

                if (auth.error) {
                    throw auth;
                }

                if (auth) {
                    this.auth = auth;
                    return auth;
                }
            }
        } catch (err) {
            throw logError(err);
        }
    }
}

module.exports = UsersClass;
