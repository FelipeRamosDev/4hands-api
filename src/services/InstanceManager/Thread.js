const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const InstanceBase = require('./InstanceBase');
const DataMessage = require('./DataMessage');

class Thread extends InstanceBase {
    constructor(setup) {
        super(setup);

        this.type = 'thread';
        this.isThread = !isMainThread;
    }

    init(parent) {
        if (parent) {
            this.setParent(parent);
        }

        if (!this.isThread) {
            this.setValue('parentCore', this.parent?.cleanOut);
            this.worker = new Worker(this.filePath, {
                workerData: this.getAllValues()
            });

            // Adding basic listeners
            this.worker.on('online', this.callbacks.onReady.bind(this));
            this.worker.on('exit', this.callbacks.onClose.bind(this));
            this.worker.on('error', this.callbacks.onError.bind(this));
            this.worker.on('errormessage', this.callbacks.onError.bind(this));
        } else {
            // Setting the workerData coming from parent to the Thread's dataStore.
            Object.keys(workerData).map(key => this.setValue(key, workerData[key]));

            parentPort.on('message', (dataMsg, ...params) => {
                const dataMessage = DataMessage.build(dataMsg);

                if (!dataMessage) {
                    return this.callbacks.onData.call(this, dataMsg, ...params);
                }

                if (dataMessage.isArrived(this.threadPath)) {
                    if (!dataMessage.route) {
                        return this.callbacks.onData.call(this, dataMsg.from, dataMsg.data);
                    }

                    const route = this.getRoute(dataMessage.route);
                    route.trigger(dataMessage);
                }
            });
        }

        this.isInit = true;
        return this;
    }

    get parentCore() {
        return this.getValue('parentCore');
    }

    get threadPath() {
        if (this.parentCore?.tagName) {
            return `/${this.parentCore.tagName}/${this.tagName}`;
        }
    }

    get cleanOut() {
        return JSON.parse(JSON.stringify({
            ...this,
            parent: undefined
        }));
    }

    postMe(...data) {
        if (!this.isThread) {
            this.worker.postMessage(...data);
        }
    }

    parentPost(...data) {
        if (this.isThread) {
            parentPort.postMessage(...data);
        }
    }

    sendMe(from, data, route) {
        if (!this.isThread) {
            const dataMessage = DataMessage.build({ target: this.threadPath, route, data, from });

            if (!dataMessage) return;
            this.worker.postMessage(dataMessage.toObject());
        }
    }

    sendTo(target, data, route) {
        if (this.isThread) {
            const dataMessage = DataMessage.build({ target, route, data, from: this.threadPath });

            if (!dataMessage) return;
            this.parentPost(dataMessage.toObject());
        }
    }

    sendToCore(data) {
        if (this.isThread) {
            this.sendTo('/', data);
        }
    }

    sendToCluster(data) {
        if (this.isThread) {
            this.sendTo('/', data);
        }
    }
}

module.exports = Thread;
