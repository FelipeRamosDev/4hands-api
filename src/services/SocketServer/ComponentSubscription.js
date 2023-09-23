const SocketSubscription = require('./SocketSubscription');

class ComponentSubscription extends SocketSubscription {
    constructor(setup, connection) {
        super(setup, connection);

        try {
            const { component } = Object(setup);

            this.type = 'component';
            this.component = component;

            this.setClientChangeListener();
            this.appendComponent();
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    toClient() {
        try {
            if (!this.component) {
                return;
            }

            this.socket.emit('subscribe:component:data:' + this.subscriptionUID, this.component.renderToString().toSuccess());
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    toClientError(error) {
        try {
            if (!this.component) {
                return;
            }

            const err = new Error.Log(error);
            this.socket.emit('subscribe:component:error:' + this.subscriptionUID, err.response());
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    updateComponent(mergeData) {
        try {
            this.connection.updateComponent(this.subscriptionUID, mergeData);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    setClientChangeListener() {
        try {
            this.socket.on('subscribe:component:clientupdate:' + this.subscriptionUID, (mergeData) => {
                this.connection.updateComponent(this.subscriptionUID, mergeData);
            });
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    appendComponent() {
        try {
            this.connection.appendComponent(this);
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = ComponentSubscription;

