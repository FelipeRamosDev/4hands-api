async function preSave(next) {
    try {
        const signedUp = await this.signUp();

        if (signedUp instanceof Error.Log || !signedUp){
            throw signedUp;
        }

        if (!this.userName) {
            this.userName = this.email;
        }

        this.auth = signedUp._id;
        next();
    } catch (err) {
        throw new Error.Log(err);
    }
}

module.exports = {
    preSave
};
