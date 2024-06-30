const AuthBucket = require('4hands-api/src/models/collections/AuthBucket');
const AuthService = require('4hands-api/src/services/Auth');

class AuthBucketsClass {
    static Model = AuthBucket;

    /**
     * The AuthService instance associated with this AuthBucket.
     * @property {AuthService}
     */
    get service() {
        return new AuthService({ parent: this });
    }
}

module.exports = AuthBucketsClass;
