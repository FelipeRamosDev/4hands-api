const User = require('4hands-api/src/models/collections/User');
const AuthBucket = require('4hands-api/src/models/collections/AuthBucket');

class UsersClass {
    static Model = User;

    async signUp() {
        try {
            if (this.isNew) {
                const auth = await AuthBucket.draft(this);

                if (auth instanceof Error.Log) {
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
