async function preSave(next) {
    try {
        const signedUp = await this.signUp();

        if (signedUp.error || !signedUp){
            throw signedUp;
        }

        if (!this.userName) {
            this.userName = this.email;
        }

        this.auth = signedUp._id;
        next();
    } catch (err) {
        throw logError(err);
    }
}

module.exports = {
    preSave
};
