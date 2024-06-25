const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const InstanceBase = require('./InstanceBase');
const DataMessage = require('./DataMessage');

/**
 * Represents a thread in a multi-threaded environment, extending the capabilities of InstanceBase.
 */
class Thread extends InstanceBase {
    /**
     * Creates an instance of Thread.
     * @param {Object} setup - The setup object for the Thread.
     */
    constructor(setup) {
        super(setup);

        this.type = 'thread';
        this.isThread = !isMainThread;
    }

    /**
     * Initializes the thread, setting up worker if it's the main thread or handling incoming messages if it's a worker thread.
     * @param {InstanceBase} [parent] - The parent instance to associate with this thread.
     * @returns {Thread} The initialized thread instance.
     */
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

    /**
     * Retrieves the thread ID if this is a worker thread.
     * @returns {number|undefined} The thread ID or undefined if not a worker thread.
     */
    get threadID() {
        if (this.isThread) {
            return this.worker?.threadId;
        }
    }

    /**
     * Retrieves the parent core value from the data store.
     * @returns {Object} The parent core value.
     */
    get parentCore() {
        return this.getValue('parentCore');
    }

    /**
     * Constructs the path for this thread based on its parent core and tag name.
     * @returns {string|undefined} The constructed thread path or undefined if no parent core is present.
     */
    get threadPath() {
        if (this.parentCore?.tagName) {
            return `/${this.parentCore.tagName}/${this.tagName}`;
        }
    }

    /**
     * Creates a clone of this Thread instance.
     * @returns {Thread} A new Thread instance cloned from this one.
     */
    clone() {
        return new Thread(this);
    }

    /**
     * Generates a clean output of this Thread instance without circular references or non-serializable values.
     * @returns {Object} A clean representation of this Thread instance.
     */
    getCleanOut() {
        return JSON.parse(JSON.stringify({
            ...this,
            parent: undefined
        }));
    }

    /**
     * Handles incoming data messages, processing them or forwarding them as needed.
     * @param {Object} dataMsg - The incoming data message object.
     * @param {...any} params - Additional parameters passed along with the data message.
     */
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

    /**
     * Posts data to this thread if it's the main thread.
     * @param {...any} data - The data to post to the worker thread.
     */
    postMe(...data) {
        if (!this.isThread) {
            this.worker.postMessage(...data);
        }
    }

    /**
     * Posts data to the parent port if this is a worker thread.
     * @param {...any} data - The data to post to the parent port.
     */
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

    /**
     * Sends a message from this thread to itself if it's the main thread, constructing a DataMessage object for it.
     * @param {string} from - The origin of the message.
     * @param {Object} data - The data to send in the message.
     * @param {string} [route] - The route associated with the message, if any.
     */
    sendMe(from, data, route) {
        if (!this.isThread) {
            const dataMessage = DataMessage.build({ target: this.threadPath, route, data, from });

            if (!dataMessage) return;
            this.worker.postMessage(dataMessage.toObject());
        }
    }

    /**
     * Sends a message to a specified target, constructing a DataMessage object for it.
     * @param {string} target - The target path to send the message to.
     * @param {Object} data - The data to send in the message.
     * @param {string} [route] - The route associated with the message, if any.
     */
    sendTo(target, data, route) {
        if (this.isThread) {
            const dataMessage = DataMessage.build({ target, route, data, from: this.threadPath });

            if (!dataMessage) return;
            this.parentPost(dataMessage.toObject());
        }
    }

    /**
     * Sends a message to the core associated with this thread.
     * @param {Object} data - The data to send in the message.
     * @param {string} [route] - The route associated with the message, if any.
     */
    sendToCore(data, route) {
        if (this.isThread) {
            this.sendTo('/' + this.parent.tagName, data, route);
        }
    }

    /**
     * Sends a message to the cluster, targeting the root path.
     * @param {Object} data - The data to send in the message.
     */
    sendToCluster(data) {
        if (this.isThread) {
            this.sendTo('/', data);
        }
    }

    /**
     * Restarts this thread if it's the main thread.
     */
    restart() {
        if (!this.isThread) {
            this.terminate();
        }
    }

    /**
     * Terminates this thread if it's the main thread.
     */
    terminate() {
        if (!this.isThread) {
            this.worker.terminate();
        }
    }
}

module.exports = Thread;
