const { Worker } = require('worker_threads');
const cluster = require('cluster');
const InstanceBase = require('./InstanceBase');

class Thread extends InstanceBase {
    constructor(setup) {
        const { worker, parent } = Object(setup);
        super(setup);

        if (!parent) {
            this._parent = () => this.parentCore;
        }

        this.worker = worker || new Worker(this.filePath, {
            workerData: this.getAllValues()
        });

        // Adding basic listeners
        this.worker.on('online', this.callbacks.onReady.bind(this));
        this.worker.on('exit', this.callbacks.onClose.bind(this));
        this.worker.on('message', this.callbacks.onData.bind(this));
        this.worker.on('error', this.callbacks.onError.bind(this));
        this.worker.on('errormessage', this.callbacks.onError.bind(this));
    }

    get parentCore() {
        return cluster.worker;
    }
}

module.exports = Thread;
