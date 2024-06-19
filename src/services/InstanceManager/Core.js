const cluster = require('cluster');
const InstanceBase = require('./InstanceBase');
const Thread = require('./Thread');
const DataMessage = require('./DataMessage');
const path = require('path');

/**
 * Represents a core process managed by InstanceBase, handling threads and worker processes.
 */
class Core extends InstanceBase {
    /**
     * Initializes a new instance of the Core class.
     * @param {Object} setup - The setup configuration object for the Core instance.
     * @throws {Error} If there is an error during setup or thread initialization.
     */
    constructor(setup) {
        super(setup);
        const { worker, _threads = {}, threads = [] } = Object(setup);

        this._worker = () => worker || cluster.worker;
        this._threads = { ...this._threads, ..._threads };
        this.type = 'core';
        this.onlineThreads = 0;

        global._core = this;
        if (this.isWorker) {
            if (threads.length) {
                threads.map(threadPath => {
                    try {
                        const configPath = path.normalize(
                            __dirname.replace(
                                path.normalize('/node_modules/4hands-api/src/services/InstanceManager'),
                                threadPath
                            )
                        );

                        const thread = require(configPath).init(this);
                        this.setThread(this.addThreadListeners(thread, threads.length));
                    } catch (err) {
                        throw logError(err);
                    }
                });
            } else {
                // If any thread needs to be started, then the CORE is READYs
                if (this.worker.state === 'online') {
                    this.callbacks.onReady.call(this);
                }
            }

            if (!this.worker?._events?.message) {
                this.worker.on('message', this.handleThreadData.bind(this));
            }

            this.worker.on('exit', this.callbacks.onClose.bind(this));
            this.worker.on('error', this.callbacks.onError.bind(this));
            this.worker.on('errormessage', this.callbacks.onError.bind(this));
        } else {
            global._parentCore = this;
        }
    }

    /**
     * Checks if the current process is a worker process.
     * @returns {boolean} True if the current process is a worker, false otherwise.
     */
    get isWorker() {
        return cluster.isWorker;
    }

    /**
     * Gets the path associated with this core instance.
     * @returns {string} The core path.
     */
    get corePath() {
        return `/${this.tagName}`;
    }

    /**
     * Returns a clean output of the core's properties excluding any parent references.
     * @returns {Object} The cleaned output object.
     */
    getCleanOut() {
        return JSON.parse(JSON.stringify({
            ...this,
            parent: undefined
        }));
    }

    /**
     * Gets the worker associated with this core instance.
     * @returns {Object|undefined} The worker object or undefined if not set.
     */
    get worker() {
        return this._worker();
    }

    /**
     * Gets the index of this core if it is a worker process.
     * @returns {number|undefined} The core index or undefined if not a worker or not set.
     */
    get coreIndex() {
        if (this.isWorker) {
            return cluster.worker?.id;
        } else {
            return this.worker?.id;
        }
    }

    /**
     * Handles incoming data messages from threads, routing them appropriately based on their content and target.
     * @param {Object} dataMsg - The data message received from a thread.
     * @param {...*} params - Additional parameters passed along with the data message.
     */
    handleThreadData(dataMsg, ...params) {
        const dataMessage = DataMessage.build(dataMsg);

        // If it's not a valid DataMessage format, then trigger onData and deliver the message the way it is.
        if (!dataMessage) {
            return this.callbacks.onData.call(this, dataMsg, ...params);
        }

        // Check if the target of the DataMessage match with the current Core path.
        if (dataMessage.isArrived(this.corePath)) {
            if (dataMessage.route) {
                const route = this.getRoute(dataMessage.route);

                if (route) {
                    return route.trigger(dataMessage);
                } else {
                    // If the route endpoint wasn't found, then call the onData callback and deliver the DataMessage since we hit the target
                    return this.callbacks.onData.call(this, dataMsg.from, dataMsg.data);
                }
            } else {
                // If it doesn't have a route set, then call the onData callback and deliver the DataMessage since we hit the target
                return this.callbacks.onData.call(this, dataMsg.from, dataMsg.data);
            }
        }

        // If the DataMessage is set with "isToMaster" property to true, then the target is the Cluster, so send it to the Cluster
        if (dataMessage.isToMaster) {
            return this.sendToCluster(dataMsg, ...params);
        }

        // If we not arrived, but the current Core path match, that means the target if in one of the child Thread of this current Core.
        if (dataMessage.isCoreMatch(this.tagName)) {
            const thread = this.getThread(dataMessage.targetThread);

            // If the target Thread exist, then it will redirect to the Thread. But if don't exist, it will call the callback onData.
            if (thread) {
                return thread.postMe(dataMsg, ...params);
            } else if (!dataMessage.targetThread) {
                return this.callbacks.onData.call(this, dataMsg.from, dataMsg.data);
            }
        } else {
            // If the core target doesn't match, we have nothing to do on this level, we need to go up to Cluster.
            return this.sendToCluster(dataMsg, ...params);
        }
    }

    /**
     * Sets the worker for this core instance.
     * @param {Object} worker - The worker to set for this core.
     */
    setWorker(worker) {
        this._worker = () => worker;
    }

    /**
     * Creates a new thread or initializes an existing thread instance.
     * @param {Thread|Object} thread - The thread instance or configuration object to create a new thread.
     * @returns {Thread|undefined} The initialized thread instance or undefined if not a worker.
     */
    createThread(thread) {
        if (!this.isWorker) {
            return;
        }

        if (thread instanceof Thread) {
            thread.init(this);
            thread = this.addThreadListeners(thread);

            this.setThread(thread);
        } else {
            const newThread = this.setThread(thread);
            return newThread.init();
        }
    }

    /**
     * Adds event listeners to a thread and increments the count of online threads.
     * @param {Thread} thread - The thread to add listeners to.
     * @param {number} [threadsLength] - The total number of threads expected to be online.
     * @returns {Thread} The thread with added listeners.
     */
    addThreadListeners(thread, threadsLength) {
        thread.worker.on('online', () => {
            this.onlineThreads++;

            if ((threadsLength == undefined || threadsLength === this.onlineThreads) && this.worker.state === 'online') {
                this.callbacks.onReady.call(this);
            }
        });

        thread.worker.on('message', this.handleThreadData.bind(this));
        return thread;
    }

    /**
     * Retrieves a thread from the core's threads by its tag name.
     * @param {string} tagName - The tag name of the thread to retrieve.
     * @returns {Thread|undefined} The retrieved thread or undefined if not found.
     */
    getThread(tagName) {
        return this._threads[tagName];
    }

    /**
     * Sets a new thread in the core's threads using either an existing Thread instance or a configuration object.
     * @param {Thread|Object} params - The Thread instance or configuration object to set a new thread.
     * @returns {Thread} The set thread instance.
     */
    setThread(params) {
        let thread;

        if (params instanceof Thread) {
            thread = params;
        } else {
            thread = new Thread(params);
        }

        this._threads[thread.tagName] = thread;
        return thread;
    }

    /**
     * Deletes a thread from the core's threads by its tag name.
     * @param {string} tagName - The tag name of the thread to delete.
     */
    deleteThread(tagName) {
        delete this._threads[tagName];
    }

    /**
     * Sends data from this core instance to its associated worker process, if it is not a worker itself.
     * @param {...*} data - The data to send to the worker process.
     */
    postMe(...data) {
        if (!this.isWorker) {
            this.worker.send(...data);
        }
    }

    /**
     * Sends data to a specified target within the cluster, potentially routing it through other cores or threads.
     * @param {string} target - The target core or thread tag name within the cluster to send data to.
     * @param {*} data - The data to send to the target.
     * @param {string} [route] - An optional route path for more granular targeting within the cluster hierarchy.
     */
    sendTo(target, data, route) {
        if (this.isWorker) {
            const dataMessage = DataMessage.build({ target, route, data, from: this.corePath });

            if (!dataMessage) return;
            if (dataMessage.targetCore === this.tagName) {
                const thread = this.getThread(dataMessage.targetThread);

                if (thread) {
                    thread.sendMe(dataMessage.from, dataMessage.data, dataMessage.route);
                } else {
                    const route = this.getRoute(dataMessage.route);

                    if (route) {
                        route.trigger(dataMessage.toObject());
                    } else {
                        this.postMe(dataMessage.toObject());
                    }
                }
            } else {
                this.sendToCluster(dataMessage);
            }
        }
    }

    /**
     * Sends data directly to a specified thread within this core instance.
     * @param {string} threadTag - The tag name of the target thread within this core instance.
     * @param {*} data - The data to send to the target thread.
     */
    sendToThread(threadTag, data) {
        if (this.isWorker) {
            this.sendTo(`${this.corePath}/${threadTag}`, data);
        }
    }

    /**
     * Sends data from this core instance up to the cluster master process, if it is a worker process.
     * @param {...*} data - The data to send up to the cluster master process.
     */
    sendToCluster(...data) {
        if (this.isWorker) {
            process.send(...data);
        }
    }

    /**
     * Triggers an error callback with the provided error object.
     * @param {Error} err - The error object to pass to the onError callback.
     */
    throwError(err) {
        this.callbacks.onError(err);
    }

    /**
     * Terminates a specified thread within this core instance and removes it from the core's threads list.
     * @param {string} threadTag - The tag name of the thread to terminate and remove.
     */
    terminateThread(threadTag) {
        const thread = this.getThread(threadTag);

        if (thread) {
            thread.terminate();
            this.deleteThread(threadTag);
        }
    }
}

module.exports = Core;
