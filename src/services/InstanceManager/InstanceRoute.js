class InstanceRoute {
    constructor(setup, instance) {
        const { path, controller = () => {} } = Object(setup);

        this.path = path;
        this.controller = controller;

        this._instance = () => instance;
    }

    get instance() {
        return this._instance();
    }

    setInstance(instance) {
        this._instance = () => instance;
    }

    trigger(dataMsg) {
        this.controller.call(this, dataMsg.data, dataMsg, this.instance );
    }
}

module.exports = InstanceRoute;
