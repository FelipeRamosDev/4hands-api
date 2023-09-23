const _Global = require('../maps/_Global');
const AuthBucket = require('./AuthBucket');
const CRUD = require('@CRUD');
const dbHelpers = require('@helpers/database/dbHelpers');
const FS = require('@services/FS');
const config = require('@config');
const sessionCLI = FS.isExist(config.sessionPath) && require('@SESSION_CLI') || {};

class User extends _Global {
    constructor(setup){
        super({...setup, validationRules: 'users'}, () => this);
        if (!setup || setup.oid()) return;
        
        const {
            auth,
            userName,
            firstName,
            lastName,
            email,
            phone
        } = Object(setup);

        try {
            this.collectionName = 'users';
            this.userName = userName;
            this.displayName = `${firstName} ${lastName} (${email})`;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.phone = phone;
            this.frontURL = frontURL;
            
            this._auth = () => new AuthBucket(Object(auth), this);
            this.placeDefault();
        } catch(err) {
            new Error.Log(err).append('common.model_construction', 'User');
        }
    }

    get fullName() {
        return (this.firstName || '') + (this.lastName ? ' ' : '') + (this.lastName || '');
    }

    get auth() {
        return this._auth();
    }

    get authService() {
        return this.auth && this.auth.service;
    }

    get token() {
        return this.authService.createUserToken();
    }

    get userSession() {
        return sessionCLI[this._id];
    }

    get currentUser() {
        return sessionCLI.currentUser;
    }

    static userSession() {
        return sessionCLI[this.currentUser()];
    }

    static currentUser() {
        return sessionCLI.currentUser;
    }

    async signOut() {
        try {
            const signedOut = await this.authService.signOut(this.userSession.token);
            return signedOut;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    toSession() {
        return {
            _id: this._id,
            index: this.index,
            firstName: this.firstName,
            lastName: this.lastName,
            fullName: this.fullName,
            email: this.email,
            jira: this.jira,
            userToken: this.token,
            gitHubToken: this.auth.gitHubToken,
            gitHubUser: this.auth.gitHubUser,
        };
    }

    toPublic(append) {
        const dataOut = {...this, ...append};

        delete dataOut.auth;
        delete dataOut._schema;
        delete dataOut.gitHubConnection;
        return dataOut;
    }

    static async getMyUser(filter) {
        try {
            const currentUser = filter || sessionCLI.currentUser || '';
            const userDOC = await this.getUser(currentUser);

            if (userDOC instanceof Error.Log) {
                throw userDOC;
            }

            return userDOC;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static async getUser(filter) {
        try {
            const userDOC = await CRUD.getDoc({collectionName: 'users', filter}).defaultPopulate();

            if (!userDOC instanceof Error.Log) {
                throw userDOC;
            }

            if (!userDOC) {
                return new Error.Log('user.not_found', filter);
            }

            const initialized = userDOC.initialize();
            if (!initialized.gitHub && initialized.auth.gitHubToken) {
                await initialized.updateDB({data: {
                    gitHub: await initialized.loadGitHubData()
                }});
            } 

            return initialized;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static async isExist(userName, returnUID) {
        try {
            const result = await dbHelpers.isDocExist('users', { userName });
            if (result instanceof Error.Log) {
                throw result;
            }

            if (result && result._id.oid()) {
                if (returnUID) {
                    return result.toString();
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static async create(setup, options) {
        try {
            const { userName, email, password } = Object(setup);
            const { preventSignIn } = Object(options);

            // Check if the userName or email (that can be an userName) is already in use
            const isExist = await this.isExist(userName || email);
            // If the user is already in use throw an error
            if (isExist) {
                return new Error.Log('auth.user_in_use');
            }

            const newUser = await CRUD.create('users', setup);
            if (newUser instanceof Error.Log) {
                throw newUser;
            }

            return Object().toSuccess();
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static async signIn(userName, password) {
        try {
            const userDOC = await CRUD.getDoc({ collectionName: 'users', filter: { userName }}).defaultPopulate();

            if (!userDOC) {
                return new Error.Log('auth.user_not_found', userName);
            }

            const user = userDOC.initialize();
            const signedIn = await user.authService.signIn(password);

            if (signedIn.success) {
                return user;
            } else {
                return signedIn;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = User;
