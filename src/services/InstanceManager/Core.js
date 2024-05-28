const cluster = require('cluster');
const InstanceBase = require('./InstanceBase');
const Thread = require('./Thread');
const path = require('path');

class Core extends InstanceBase {
    constructor(setup) {
        const { worker, threads = [] } = Object(setup);
        super(setup);

        this._worker = () => worker || cluster.worker;
        this._threads = {};
        this.type = 'core';
        this.onlineThreads = 0;

        if (cluster.isWorker) {
            threads.map(threadPath => {
                try {
                    const configPath = path.normalize(
                        __dirname.replace(
                            path.normalize('/node_modules/4hands-api/src/services/InstanceManager'),
                            threadPath
                        )
                    );
                    
                    const thread = require(configPath);
                    this.setThread(thread);
                    thread.worker.on('online', () => {
                        this.onlineThreads++;

                        if (this.onlineThreads === threads.length && this.worker.state === 'online') {
                            this.callbacks.onReady.call(this);
                        }
                    });

                    thread.worker.on('message', this.handleThreadData.bind(this));
                } catch (err) {
                    throw logError(err);
                }
            });

            this.worker.on('message', this.callbacks.onData.bind(this));
            this.worker.on('exit', this.callbacks.onClose.bind(this));
            this.worker.on('error', this.callbacks.onError.bind(this));
            this.worker.on('errormessage', this.callbacks.onError.bind(this));
        }
    }

    get worker() {
        return this._worker();
    }

    get coreIndex() {
        if (cluster.isWorker) {
            return cluster.worker?.id;
        } else {
            return this.worker.id;
        }
    }

    handleThreadData(messageData, ...params) {
        if (typeof messageData === 'object' && !Array.isArray(messageData) && messageData !== null) {
            const { target, from, data } = Object(messageData);

            if (target === '/') {
                return this.sendToCluster(messageData, ...params);
            }

            if (typeof target === 'string') {
                const parsedPath = target.split('/');

                if (parsedPath.length === 1) {
                    // this.sendToCore()
                }
            }

            this.callbacks.onData.call(this, messageData, ...params);
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

        thread.setParent(this);
        this._threads[thread.tagName] = thread;
        return thread;
    }

    send(...data) {
        this.worker.send(...data);
    }

    sendToThread(threadTag, ...data) {
        const thread = this.getThread(threadTag);
        thread.send(...data);
    }

    sendToCluster(...data) {
        process.send(...data);
    }
}

module.exports = Core;
