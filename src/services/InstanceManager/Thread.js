const { Worker, isMainThread, parentPort } = require('worker_threads');
const cluster = require('cluster');
const InstanceBase = require('./InstanceBase');
const MessageData = require('./MessageData');

class Thread extends InstanceBase {
    constructor(setup) {
        const { worker } = Object(setup);
        super(setup);

        this.type = 'thread';
        this.isThread = !isMainThread;

        if (!this.isThread) {
            this.worker = worker || new Worker(this.filePath, {
                workerData: this.getAllValues()
            });

            // Adding basic listeners
            this.worker.on('online', this.callbacks.onReady.bind(this));
            this.worker.on('exit', this.callbacks.onClose.bind(this));
            this.worker.on('error', this.callbacks.onError.bind(this));
            this.worker.on('errormessage', this.callbacks.onError.bind(this));
        } else {
            parentPort.on('message', this.callbacks.onData.bind(this));
        }
    }

    get parentCore() {
        return cluster.worker || this.parent;
    }

    get threadPath() {
        return `/${this.getValue('parentCore')}/${this.tagName}`;
    }

    send(...data) {
        this.worker.postMessage(...data);
    }

    sendTo(target, data) {
        if (this.isThread) {
            const messageData = new MessageData({ target, data, from: this.threadPath });
            parentPort.postMessage(messageData);
        }
    }

    sendToCore(...data) {
        if (this.isThread) {
            parentPort.postMessage(...data);
        }
    }

    sendToCluster(data) {
        this.sendTo('/', data);
    }
}

module.exports = Thread;
