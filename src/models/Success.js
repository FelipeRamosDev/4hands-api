class Success {
    constructor(data, message) {
        if (data._schema) {
            delete data._schema;
        }

        this.success = true;
        this.data = data;
        this.message = message;
    }

    toJSON() {
        try {
            return JSON.stringify({...this});
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Success;
