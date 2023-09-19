class LogBase {
    constructor({
        status,
        type,
        name,
        message,
        resource
    }) {
        this.status = status;
        this.type = type || 'log';
        this.name = name;
        this.message = message;
        this.resource = resource;
    }

    toJSON() {
        try {
            return JSON.stringify({...this});
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    notify() {}

    emailNotify() {}
}

module.exports = LogBase;
