const AuthService = require('@services/Auth');

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

module.exports = {
    preSave
};
