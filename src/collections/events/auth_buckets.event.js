const AuthService = require('4hands-api/src/services/Auth');

async function preSave(next) {
    try {
        const auth = new AuthService();
        const hash = await auth.createHash(this.password);

        if (hash instanceof Error.Log || !hash) {
            throw hash;
        }

        this.password = hash;
        next();
    } catch (err) {
        throw new Error.Log(err);
    }
}

async function preUpdate(next) {
    try {
        if (this._update.password) {
            const auth = new AuthService();
            const hash = await auth.createHash(this._update.password);
    
            if (hash instanceof Error.Log || !hash) {
                throw hash;
            }
    
            this._update.password = hash;
        }

        next();
    } catch (err) {
        throw new Error.Log(err);
    }
}

module.exports = {
    preSave,
    preUpdate
};
