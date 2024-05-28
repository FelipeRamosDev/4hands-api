const InstanceBase = require('./InstanceBase');
const Core = require('./Core');
const cluster = require('cluster');
const path = require('path');

class Cluster extends InstanceBase {
    constructor(setup) {
        super(setup);

        try {
            const os = require('os');
            const maxCPUs = os.cpus().length;
            const { cores = [] } = Object(setup);

            this.type = 'cluster';
            if (this.isMaster) {
                this._cores = {};
                this.onlineCores = 0;

                cores.map((configs, coreIndex) => {
                    if (coreIndex >= maxCPUs) {
                        throw logError('Maximum CPUs number exceeded!');
                    }

                    if (typeof configs === 'string') {
                        // That means the "configs" is actually the path to the core file

                        const configPath = path.normalize(
                            __dirname.replace(
                                path.normalize('/node_modules/4hands-api/src/services/InstanceManager'),
                                configs
                            )
                        );

                        const loadedCore = require(configPath);
                        loadedCore.setWorker(cluster.fork());
                        this.setCore(loadedCore);
                    } else {
                        configs.worker = cluster.fork();
                        this.setCore(configs);
                    }

                    cluster.on('online', () => {
                        this.onlineCores++;

                        if (this.onlineCores === cores.length) {
                            this.callbacks.onReady.call(this);
                        }
                    });

                    cluster.on('error', (err) => {
                        this.callbacks.onError.call(this, toError(err));
                    });
                });

                cluster.on('message', (worker, messageData, ...args) => {
                    const { target, from, data } = Object(messageData);
                    const dataToSend = data || messageData;
                    let fromPath = from;

                    if (!fromPath) {
                        const fromWorker = this.findCore(worker.id)
                        fromPath = fromWorker?.tagName
                    }

                    if (!target || target === '/') {
                        this.callbacks.onData.call(this, fromPath, dataToSend, ...args);
                    } else {
                        // Redirect here
                    }
                });
            } else {
                const worker = cores[this.workerID - 1];
                
                if (typeof worker === 'string') {
                    // That means the "worker" is actually the path to the core file

                    const configPath = path.normalize(
                        __dirname.replace(
                            path.normalize('/node_modules/4hands-api/src/services/InstanceManager'),
                            worker.replace('.', '')
                        )
                    );

                    const newCore = require(configPath);
                    this.setCore(newCore);
                }
            }
        } catch (err) {
            if (this.isMaster) {
                this.callbacks.onError.call(this, err);
            }
        }
    }

    get isMaster() {
        return cluster.isMaster;
    }

    get isWorker() {
        return cluster.isWorker;
    }

    get workerID() {
        if (this.isWorker) {
            return cluster.worker.id;
        }
    }

    get childCore() {
        return this._childCore;
    }

    getCore(tagName) {
        if (this.isMaster) {
            return this._cores[tagName];
        }
    }

    findCore(index) {
        const tagName = Object.keys(this._cores).find(key => (this._cores[key].coreIndex === index));
        return this.getCore(tagName);
    }

    setCore(params) {
        const core = new Core(params);

        if (this.isMaster) {
            this._cores[core.tagName] = core;
        } else {
            this._childCore = core;
        }
    }
    
    sendTo(coreTagName, data) {
        const core = this.getCore(coreTagName);

        if (core) {
            core.send(data);
        }
    }
}

module.exports = Cluster;
