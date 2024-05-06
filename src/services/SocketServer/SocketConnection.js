/**
 * Manages socket connections and subscriptions.
 */
class SocketConnection {
    /**
     * Creates an instance of SocketConnection.
     * @param {Object} socket - The socket object representing the connection.
     * @param {Object} serverInstance - The server instance associated with the connection.
     */
    constructor(socket, serverInstance) {
        try {
            /**
             * Returns the server instance associated with the connection.
             * @returns {Object} - The server instance.
             */
            this._serverInstance = () => serverInstance;

            /**
             * The socket object representing the connection.
             * @type {Object}
             */
            this.socket = socket;

            /**
             * Array to store active subscriptions.
             * @type {Array}
             */
            this.subscriptions = [];

            this.init();
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Gets the server instance associated with the connection.
     * @returns {Object} - The server instance.
     */
    get serverInstance() {
        return this._serverInstance();
    }

    /**
     * Initializes socket event listeners and connection status.
     */
    init() {
        this.socket.on('connection:status', this.onConnectionStatus.bind(this));
        this.socket.on('subscribe:doc', this.subscribeDOC.bind(this));
        this.socket.on('subscribe:component', this.subscribeComponent.bind(this));

        /**
         * Object property to store subscribed components.
         * @type {Object}
         */
        this.socket.data.subscribedComponents = {};

        this.emitConnectionStatus();
    }

    /**
     * Handles 'connection:status' event by emitting connection status.
     */
    onConnectionStatus() {
        this.emitConnectionStatus();
    }

    /**
     * Emits connection status to the client.
     */
    emitConnectionStatus() {
        this.socket.emit('connection:status', this.socket.id);
    }

    /**
     * Subscribes to a document based on the provided setup.
     * @param {Object} setup - Configuration options for the document subscription.
     * @returns {Object} - The document subscription instance.
     */
    async subscribeDOC(setup) {
        const { collectionName, filter } = Object(setup);

        try {
            const subs = new DocSubscription({ ...setup }, this.socket);

            this.subscriptions.push(subs);
            const doc = await subs.trigger();

            if (doc) {
                process.on(`socket:update:${collectionName}:${JSON.stringify(filter)}`, () => {
                    subs.trigger().catch(err => {
                        throw logError(err);
                    });
                });

                this.socket.emit('subscribe:doc:success', doc);
                return subs;
            }
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Subscribes to a component based on the provided setup.
     * @param {Object} setup - Configuration options for the component subscription.
     * @returns {Object} - The component subscription instance.
     */
    async subscribeComponent(setup) {
        const { path, dataDependencies, data, subsUID } = Object(setup);

        try {
            const Component = require('@www/' + path);
            const comp = new Component({ dataDependencies, ...data, subscriptionUID: subsUID });
            const subscription = new ComponentSubscription({ component: comp, subscriptionUID: subsUID }, this);

            if (comp.load) {
                await comp.load();
            }

            comp.dataDependencies.map(item => item.addSocketUpdateListener(this, subscription.subscriptionUID));
            subscription.socket.emit('subscribe:component:success:' + subscription.subscriptionUID, comp.renderToString().toSuccess());
            this.subscriptions.push(subscription);
            return comp;
        } catch (err) {
            this.socket.emit('subscribe:component:error:' + subsUID, logError(err));
        }
    }

    /**
     * Appends a component subscription to the subscribed components list.
     * @param {Object} subscription - The component subscription instance.
     * @returns {Object} - The component object.
     */
    appendComponent(subscription) {
        try {
            if (!subscription.socket) {
                return;
            }

            if (!subscription.socket.data.subscribedComponents) {
                subscription.socket.data.subscribedComponents = {};
            }

            subscription.socket.data.subscribedComponents[subscription.subscriptionUID] = subscription.component;
            return subscription.component;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Gets the component object associated with the provided subscription UID.
     * @param {string} subscriptionUID - The unique identifier for the component subscription.
     * @returns {Object} - The component object.
     */
    getComponent(subscriptionUID) {
        try {
            if (!this.socket || !this.socket.data.subscribedComponents) {
                return;
            }

            return this.socket.data.subscribedComponents[subscriptionUID];
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Gets the subscription object associated with the provided subscription UID.
     * @param {string} subscriptionUID - The unique identifier for the subscription.
     * @returns {Object} - The subscription object.
     */
    getSubscription(subscriptionUID) {
        try {
            if (!this.socket || !this.subscriptions) {
                return;
            }

            return this.subscriptions.find(item => item.subscriptionUID === subscriptionUID);
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Updates the component associated with the provided subscription UID using merge data.
     * @param {string} subscriptionUID - The unique identifier for the component subscription.
     * @param {Object} mergeData - The data used for merging and updating the component.
     * @returns {Object} - The updated component object.
     */
    updateComponent(subscriptionUID, mergeData) {
        try {
            const component = this.socket.data.subscribedComponents[subscriptionUID];

            component.updateMerge(mergeData);
            const stringHTML = component.renderToString();

            this.socket.emit('subscribe:component:data:' + subscriptionUID, stringHTML.toSuccess());
            return component;
        } catch (err) {
            throw logError(err);
        }
    }
}

module.exports = SocketConnection;
