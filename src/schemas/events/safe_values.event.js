
module.exports = {
    async preSave(next) {
        const { derivatedKey, encrypted, iv, salt } = this.encrypt;

        this.encrypted = encrypted;
        this.derivatedKey = derivatedKey;
        this.iv = iv;
        this.salt = salt;

        next();
    },

    async preUpdate(next) {
        const encrypt = this.encrypt();
        const { derivatedKey, encrypted, iv, salt } = encrypt;

        this._update.encrypted = encrypted;
        this._update.derivatedKey = derivatedKey;
        this._update.iv = iv;
        this._update.salt = salt;

        next();
    }
};
