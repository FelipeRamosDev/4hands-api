const cluster = require('cluster');
const InstanceBase = require('./InstanceBase');
const Thread = require('./Thread');
const DataMessage = require('./DataMessage');
const path = require('path');

class Core extends InstanceBase {
    constructor(setup) {
        const { worker, threads = [] } = Object(setup);
        super(setup);

        this._worker = () => worker || cluster.worker;
        this._threads = {};
        this.type = 'core';
        this.onlineThreads = 0;
        this.isWorker = cluster.isWorker;

        if (this.isWorker) {
            threads.map(threadPath => {
                try {
                    const configPath = path.normalize(
                        __dirname.replace(
                            path.normalize('/node_modules/4hands-api/src/services/InstanceManager'),
                            threadPath
                        )
                    );
                    
                    const thread = require(configPath).init(this);
                    thread.worker.on('online', () => {
                        this.onlineThreads++;

                        if (this.onlineThreads === threads.length && this.worker.state === 'online') {
                            this.callbacks.onReady.call(this);
                        }
                    });

                    thread.worker.on('message', this.handleThreadData.bind(this));
                    this.setThread(thread);
                } catch (err) {
                    throw logError(err);
                }
            });

            this.worker.on('message', this.handleThreadData.bind(this));
            this.worker.on('exit', this.callbacks.onClose.bind(this));
            this.worker.on('error', this.callbacks.onError.bind(this));
            this.worker.on('errormessage', this.callbacks.onError.bind(this));
        }
    }

    get corePath() {
        return `/${this.parent?.tagName}/${this.tagName}`;
    }
    
    get cleanOut() {
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
            return this.worker.id;
        }
    }

    handleThreadData(dataMsg, ...params) {
        const dataMessage = DataMessage.build(dataMsg);

        if (dataMessage) {
            if (dataMessage.isArrived(this.corePath)) {
                return this.callbacks.onData.call(this, dataMessage.from, dataMessage.data);
            }

            if (dataMessage.isToMaster) {
                return this.sendToCluster(dataMsg, ...params);
            }

            if (dataMessage.isCoreMatch(this.tagName)) {
                const thread = this.getThread(dataMessage.targetThread);

                if (thread) {
                    return thread.postMe(dataMsg, ...params);
                } else if (!dataMessage.targetThread) {
                    return this.callbacks.onData.call(this, dataMessage.from, dataMessage.data);
                }
            }
        } else {
            this.callbacks.onData.call(this, dataMsg, ...params);
        }

    }

    setWorker(worker) {
        this._worker = () => worker;
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

    postMe(...data) {
        this.worker.send(...data);
    }

    sendTo(target, data) {
        if (this.isWorker) {
            const dataMessage = DataMessage.build({ target, data, from: this.corePath });

            if (!dataMessage) return;
            if (dataMessage.targetCore === this.tagName) {
                const thread = this.getThread(dataMessage.targetThread);

                if (thread) {
                    thread.sendMe(dataMessage.from, dataMessage.data);
                }
            } else {
                this.sendToCluster(dataMessage.toObject()?.data);
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
}

module.exports = Core;
