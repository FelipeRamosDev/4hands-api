
module.exports = {
    async preSave(next) {
        const { derivatedKey, encrypted, iv, salt } = this.encrypt;

        this.encrypted = encrypted;
        this.derivatedKey = derivatedKey;
        this.iv = iv;
        this.salt = salt;

        next();
    }
};
