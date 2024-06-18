const crypto = require('crypto');
const InstanceRoute = require('./InstanceRoute');

class InstanceBase {
    constructor(setup) {
        const {
            id,
            tagName,
            filePath,
            routes = [],
            _routes = {},
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

    get parent() {
        return this._parent();
    }

    setParent(newParent) {
        this._parent = () => newParent;        
    }

    genRandomBytes(bytes = 4) {
        return crypto.randomBytes(bytes).toString('hex');
    }

    getAllValues() {
        return this._dataStore;
    }

    getValue(key) {
        return this._dataStore[key];
    }

    setValue(key, value) {
        this._dataStore[key] = value;
        return value;
    }

    deleteValue(key) {
        delete this._dataStore[key];
    }

    setRoute(route) {
        try {
            if (route instanceof InstanceRoute) {
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

    getRoute(routePath) {
        return this._routes[routePath];
    }

    triggerError(err) {
        this.callbacks.onError(err);
    }
}

module.exports = InstanceBase;
