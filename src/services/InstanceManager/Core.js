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

        if (cluster.isWorker) {
            this.coreIndex = cluster.worker?.id;
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
                } catch (err) {
                    throw logError(err);
                }
            });
        }
    }

    get worker() {
        return this._worker();
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
}

module.exports = Core;
