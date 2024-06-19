const cluster = require('cluster');
const path = require('path');
const InstanceBase = require('./InstanceBase');
const Core = require('./Core');
const DataMessage = require('4hands-api/src/services/InstanceManager/DataMessage');

/**
 * Represents a cluster of Node.js processes managed by the InstanceBase.
 */
class Cluster extends InstanceBase {
    /**
     * Initializes a new instance of the Cluster class.
     * @param {Object} setup - The setup configuration object for the Cluster instance.
     * @throws {Error} If there is an error during setup or if the maximum CPU number is exceeded.
     */
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

                cluster.on('message', (worker, dataMsg, ...args) => {
                    const dataMessage = DataMessage.build(dataMsg);
                    if (dataMessage?.isToMaster) {
                        return this.callbacks.onData.call(this, dataMsg.from, dataMsg.data);
                    }

                    if (!dataMessage || !dataMessage.targetCore) {
                        return this.callbacks.onData.call(this, dataMsg, worker, ...args);
                    }

                    const core = this.getCore(dataMessage.targetCore);
                    if (core) {
                        core.postMe(dataMsg, ...args);
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

    /**
     * Checks if the current process is the master process.
     * @returns {boolean} True if the current process is the master, false otherwise.
     */
    get isMaster() {
        return cluster.isMaster;
    }

    /**
     * Checks if the current process is a worker process.
     * @returns {boolean} True if the current process is a worker, false otherwise.
     */
    get isWorker() {
        return cluster.isWorker;
    }

    /**
     * Gets the worker ID if the current process is a worker.
     * @returns {number|undefined} The worker ID or undefined if not a worker.
     */
    get workerID() {
        if (this.isWorker) {
            return cluster.worker?.id;
        }
    }

    /**
     * Gets the child core associated with this cluster instance.
     * @returns {Object|undefined} The child core object or undefined if not set.
     */
    get childCore() {
        return this._childCore;
    }

    /**
     * Retrieves a core from the cluster by its tag name.
     * @param {string} tagName - The tag name of the core to retrieve.
     * @returns {Object|undefined} The core object or undefined if not found (or if not master).
     */
    getCore(tagName) {
        if (this.isMaster) {
            return this._cores[tagName];
        }
    }

    /**
     * Finds a core in the cluster by its index.
     * @param {number} index - The index of the core to find.
     * @returns {Object|undefined} The core object or undefined if not found.
     */
    findCore(index) {
        const tagName = Object.keys(this._cores).find(key => (this._cores[key].coreIndex === index));
        return this.getCore(tagName);
    }

    /**
     * Sets a core in the cluster with the given parameters.
     * @param {Object} params - The parameters to create a new Core instance.
     */
    setCore(params) {
        const core = new Core(params);

        if (this.isMaster) {
            this._cores[core.tagName] = core;
        } else {
            this._childCore = core;
        }
    }

    /**
     * Sends data to a specified target core in the cluster.
     * @param {string} target - The tag name of the target core or thread to send data to.
     * @param {Object} data - The data to send to the target core.
     */
    sendTo(target, data) {
        if (this.isMaster) {
            const dataMessage = DataMessage.build({ target, data, from: '/' });
            const core = this.getCore(dataMessage.targetCore);

            if (core) {
                core.postMe(dataMessage.toObject());
            }
        }
    }
}

module.exports = Cluster;
