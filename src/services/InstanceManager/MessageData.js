class MessageData {
    constructor(setup) {
        const { target, from, data } = Object(setup);

        this.target = target;
        this.from = from;
        this.data = data;
    }
}

module.exports = MessageData;
