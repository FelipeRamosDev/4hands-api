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
            this.setValue('parentCore', this.parent?.getCleanOut());
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

            parentPort.on('message', this.handleOnData.bind(this));
        }

        this.isInit = true;
        return this;
    }

    get threadID() {
        if (this.isThread) {
            return this.worker?.threadId;
        }
    }

    get parentCore() {
        return this.getValue('parentCore');
    }

    get threadPath() {
        if (this.parentCore?.tagName) {
            return `/${this.parentCore.tagName}/${this.tagName}`;
        }
    }

    clone() {
        return new Thread(this);
    }

    getCleanOut() {
        return JSON.parse(JSON.stringify({
            ...this,
            parent: undefined
        }));
    }

    handleOnData(dataMsg, ...params) {
        const dataMessage = DataMessage.build(dataMsg);

        // If it's not a valid DataMessage format, then trigger onData and deliver the message the way it is.
        if (!dataMessage) {
            return this.callbacks.onData.call(this, dataMsg, ...params);
        }

        // Check if the target of the DataMessage match with the current Thread path.
        if (dataMessage.isArrived(this.threadPath)) {
            // If it doesn't have a route set, then call the onData callback and deliver the DataMessage since we hit the target
            if (!dataMessage.route) {
                return this.callbacks.onData.call(this, dataMsg.from, dataMsg.data);
            }

            // if the code hit here, means we have a route set.
            // So we will search for the route endpoint and if it exists we will trigger it, but if not, we call the callback.
            const route = this.getRoute(dataMessage.route);
            if (route) {
                route.trigger(dataMessage);
            } else {
                this.callbacks.onData.call(this, dataMsg.from, dataMsg.data);
            }
        } else {
            // If it's not matching, since it the lower level (Thread) then send the raw message to the parent Core to handle.
            this.parentPost(dataMsg, ...params);
        }

    }

    postMe(...data) {
        if (!this.isThread) {
            this.worker.postMessage(...data);
        }
    }

    parentPost(...data) {
        if (this.isThread) {
            const toSend = data.map(item => {
                if (typeof item === 'object' && item != null) {
                    return JSON.parse(JSON.stringify(item));
                } else {
                    return item;
                }
            });

            parentPort.postMessage(...toSend);
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

    sendToCore(data, route) {
        if (this.isThread) {
            this.sendTo('/' + this.parent.tagName, data, route);
        }
    }

    sendToCluster(data) {
        if (this.isThread) {
            this.sendTo('/', data);
        }
    }

    restart() {
        if (!this.isThread) {
            this.terminate();
        }
    }

    terminate() {
        if (!this.isThread) {
            this.worker.terminate();
        }
    }
}

module.exports = Thread;
