/**
 * Represents a subscription for a specific component in the application.
 * Extends SocketSubscription class.
 */
class ComponentSubscription extends SocketSubscription {
    /**
     * Creates an instance of ComponentSubscription.
     * @param {Object} setup - Configuration options for the subscription.
     * @param {Object} connection - The connection object for managing the subscription.
     * @param {Object} setup.component - The component object associated with the subscription.
     */
    constructor(setup, connection) {
        super(setup, connection);

        try {
            const { component } = Object(setup);

            /**
             * Type identifier for the subscription (component).
             * @type {string}
             */
            this.type = 'component';

            /**
             * The component object associated with the subscription.
             * @type {Object}
             */
            this.component = component;

            // Initializes the client change listener and appends the component.
            this.setClientChangeListener();
            this.appendComponent();
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Sends the component data to the client.
     */
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

    /**
     * Sends error data to the client in case of component subscription error.
     * @param {Object} error - The error object to be sent to the client.
     */
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

    /**
     * Updates the component data by merging the provided data.
     * @param {Object} mergeData - The data object to be merged with the component.
     */
    updateComponent(mergeData) {
        try {
            this.connection.updateComponent(this.subscriptionUID, mergeData);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Sets up the client change listener for component updates.
     */
    setClientChangeListener() {
        try {
            this.socket.on('subscribe:component:clientupdate:' + this.subscriptionUID, (mergeData) => {
                this.connection.updateComponent(this.subscriptionUID, mergeData);
            });
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Appends the current component subscription to the connection.
     */
    appendComponent() {
        try {
            this.connection.appendComponent(this);
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = ComponentSubscription;
