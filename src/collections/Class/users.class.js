const User = require('4hands-api/src/models/collections/User');
const AuthBucket = require('4hands-api/src/models/collections/AuthBucket');
const _Global = require('./_globals.class');

class UsersClass extends _Global {
    static Model = User;

    constructor (setup) {
        super(setup);
    }

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

    toModel() {
        if (UsersClass.Model) {
            return new UsersClass.Model(this.toObject());
        } else {
            return new UsersClass(this);
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
