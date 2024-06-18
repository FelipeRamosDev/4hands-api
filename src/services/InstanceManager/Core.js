const cluster = require('cluster');
const InstanceBase = require('./InstanceBase');
const Thread = require('./Thread');
const DataMessage = require('./DataMessage');
const path = require('path');

class Core extends InstanceBase {
    constructor(setup) {
        super(setup);
        const { worker, _threads = {}, threads = [] } = Object(setup);

        this._worker = () => worker || cluster.worker;
        this._threads = {...this._threads, ..._threads};
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

    get isWorker() {
        return cluster.isWorker;
    }

    get corePath() {
        return `/${this.tagName}`;
    }
    
    getCleanOut() {
        return JSON.parse(JSON.stringify({
            ...this,
            parent: undefined
        }));
    }

    get worker() {
        return this._worker();
    }

    get coreIndex() {
        if (this.isWorker) {
            return cluster.worker?.id;
        } else {
            return this.worker?.id;
        }
    }

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

    setWorker(worker) {
        this._worker = () => worker;
    }

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

    getThread(tagName) {
        return this._threads[tagName];
    }

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

    deleteThread(tagName) {
        delete this._threads[tagName];
    }

    postMe(...data) {
        if (!this.isWorker) {
            this.worker.send(...data);
        }
    }

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

    sendToThread(threadTag, data) {
        if (this.isWorker) {
            this.sendTo(`${this.corePath}/${threadTag}`, data);
        }
    }

    sendToCluster(...data) {
        if (this.isWorker) {
            process.send(...data);
        }
    }

    throwError(err) {
        this.callbacks.onError(err);
    }

    terminateThread(threadTag) {
        const thread = this.getThread(threadTag);

        if (thread) {
            thread.terminate();
            this.deleteThread(threadTag);
        }
    }
}

module.exports = Core;
