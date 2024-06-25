/**
 * Represents a route within an instance, holding a reference to the instance and a controller function.
 */
class InstanceRoute {
    /**
     * Creates an instance of InstanceRoute.
     * @param {Object} setup - The setup object for the InstanceRoute.
     * @param {string} setup.path - The path associated with this route.
     * @param {Function} [setup.controller] - The controller function to be called when the route is triggered.
     * @param {InstanceBase} instance - The instance to which this route belongs.
     */
    constructor(setup, instance) {
        const { path, controller = () => {} } = Object(setup);

        this.path = path;
        this.controller = controller;

        this._instance = () => instance;
    }

    /**
     * Retrieves the instance to which this route belongs.
     * @returns {InstanceBase} The instance associated with this route.
     */
    get instance() {
        return this._instance();
    }

    /**
     * Sets a new instance for this route.
     * @param {InstanceBase} instance - The new instance to associate with this route.
     */
    setInstance(instance) {
        this._instance = () => instance;
    }

    /**
     * Triggers the controller function with provided data message.
     * @param {Object} dataMsg - The data message object to pass to the controller function.
     */
    trigger(dataMsg) {
        this.controller.call(this, dataMsg.data, dataMsg, this.instance );
    }
}

module.exports = InstanceRoute;
