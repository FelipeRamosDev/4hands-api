class Logstamp {
    static timestamp = {
        type: Date,
        default: Date.now
    };

    static activityType = {
        type: String,
        default: 'development',
        enum: ['slack', 'organization', 'development', 'other']
    }

    static activityDescription = {
        type: String,
        default: '--no-description--'
    }

    static toObject() {
        return {...this};
    }
}

module.exports = Logstamp;
