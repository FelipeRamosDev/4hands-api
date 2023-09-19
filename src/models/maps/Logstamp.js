class Logstamp {
    constructor(setup) {
        try {
            const { timestamp } = Object(setup);

            this.timestamp = timestamp;
            this.activityType = activityType;
            this.activityDescription = activityDescription;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Logstamp;
