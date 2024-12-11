const crypto = require('crypto');
const InstanceRoute = require('./InstanceRoute');
const EventEndpoint = require('../../models/settings/EventEndpoint');

/**
 * Represents a base instance with routes, data storage, and lifecycle callbacks.
 */
class InstanceBase {
    /**
     * Creates an instance of InstanceBase.
     * @param {Object} setup - The setup object for the InstanceBase.
     * @param {string} [setup.id] - The unique identifier for the instance.
     * @param {string} [setup.tagName] - The tag name associated with the instance.
     * @param {string} setup.filePath - The file path of the instance.
     * @param {InstanceRoute[]|EventEndpoint[]} [setup.routes] - An array of routes associated with the instance.
     * @param {Object} [setup._routes] - An object containing route instances keyed by their paths.
     * @param {Object} [setup.dataStore] - An object to store data associated with the instance.
     * @param {Function} [setup.onReady] - A callback function to be called when the instance is ready.
     * @param {Function} [setup.onData] - A callback function to be called when data is received.
     * @param {Function} [setup.onClose] - A callback function to be called when the instance is closed.
     * @param {Function} [setup.onError] - A callback function to be called when an error occurs.
     * @param {InstanceBase} [setup.parent] - The parent instance of this instance.
     */
    constructor(setup) {
        const {
            id,
            tagName,
            filePath,
            routes = [],
            _routes = {},
            _eventRoutes = {},
            dataStore = {},
            onReady = () => {},
            onData = () => {},
            onClose = () => {},
            onError = () => {},
            parent
        } = Object(setup);

        this._parent = () => parent;
        this._dataStore = dataStore;
        this._routes = _routes;
        this._eventRoutes = _eventRoutes;

        this.id = id || this.genRandomBytes();
        this.tagName = tagName || this.id;
        this.filePath = filePath;

        // Storing handlers
        this.callbacks = {
            onReady,
            onData,
            onClose,
            onError
        };

        routes.map(route => !this._routes[route.tagName] && this.setRoute(route));
    }

    /**
     * Retrieves the parent of this instance.
     * @returns {InstanceBase} The parent instance.
     */
    get parent() {
        return this._parent();
    }

    /**
     * Sets a new parent for this instance.
     * @param {InstanceBase} newParent - The new parent to set for this instance.
     */
    setParent(newParent) {
        this._parent = () => newParent;        
    }

    /**
     * Generates a random string of bytes in hexadecimal format.
     * @param {number} [bytes=4] - The number of bytes to generate.
     * @returns {string} A random string of bytes in hexadecimal format.
     */
    genRandomBytes(bytes = 4) {
        return crypto.randomBytes(bytes).toString('hex');
    }

    /**
     * Retrieves all values stored in this instance's data store.
     * @returns {Object} An object containing all stored values.
     */
    getAllValues() {
        return this._dataStore;
    }

    /**
     * Retrieves a value from this instance's data store by key.
     * @param {string} key - The key of the value to retrieve.
     * @returns {*} The value associated with the given key, if it exists.
     */
    getValue(key) {
        return this._dataStore[key];
    }

    /**
     * Sets a value in this instance's data store by key.
     * @param {string} key - The key of the value to set.
     * @param {*} value - The value to set for the given key.
     * @returns {*} The value that was set in the data store.
     */
    setValue(key, value) {
        this._dataStore[key] = value;
        return value;
    }

    /**
     * Deletes a value from this instance's data store by key.
     * @param {string} key - The key of the value to delete.
     */
    deleteValue(key) {
        delete this._dataStore[key];
    }

    /**
     * Sets a route for this instance. If a route already exists, it will be replaced by the new one provided or created from setup object if not an InstanceRoute already.
     * @param {(InstanceRoute|Object)} route - An InstanceRoute or setup object for creating a new InstanceRoute associated with this instance.
     * @returns {(InstanceRoute|undefined)} The newly set or created InstanceRoute, or undefined if there was an error during creation or setting of the route.
     */
    setRoute(route) {
        try {
            if (route instanceof EventEndpoint) {
                route.setInstance(this);
                this._eventRoutes[route.fullPath] = route;
                return route;
            } else if (route instanceof InstanceRoute) {
                route.setInstance(this);
                this._routes[route.path] = route;
                return route;
            } else {
                const newRoute = new InstanceRoute(route, this);
                this._routes[route.path] = newRoute;
                return newRoute;
            }
        } catch (err) {
            return;
        }
    }

    /**
     * Retrieves a route from this instance by its path.
     * @param {string} routePath - The path of the route to retrieve.
     * @returns {(InstanceRoute|undefined)} The route associated with the given path, if it exists, otherwise undefined.
     */
    getRoute(routePath) {
        return this._routes[routePath];
    }

    /**
     * Triggers an error callback with a provided error object. 
	 * This method should be called when an error occurs within the instance that needs to be handled externally. 
     */
    triggerError(err) {
        this.callbacks.onError(err);
    }
}

module.exports = InstanceBase;
