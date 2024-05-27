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

                    this.setCore(require(configPath));
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

    setCore(params) {
        const core = new Core(params);

        if (this.isMaster) {
            this._cores[core.tagName] = core;
        } else {
            this._childCore = core;
        }
    }
}

module.exports = Cluster;
