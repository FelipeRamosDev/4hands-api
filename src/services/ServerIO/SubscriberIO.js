const ServerIO = require('./index');

class SubscriberIO extends ServerIO {
    constructor(setup, serverIO) {
        super(setup, serverIO);
        const {
            updateEventName = 'subscribe:update',
            onUpdate
        } = Object(setup);

        this.isSubscriber = true;
        this.updateEventName = updateEventName;
        this.subscriptions = {};
        
        if (typeof onUpdate === 'function') {
            this.onUpdate = onUpdate;
            this.subscriberListener = process.on(updateEventName, onUpdate);
        }
    }

    subscribe() {
        // Code to create the subscription here, by instantiating the SubscriptionIO
    }

    static buildSubscriber(setup) {
        const { updateEventName, onUpdate } = Object(setup);

        return {
            ...ServerIO.buildNamespace(setup),
            isSubscriber: true,
            updateEventName,
            onUpdate
        }
    }
}

module.exports = SubscriberIO;

