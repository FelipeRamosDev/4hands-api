const Cluster = require('./Cluster');
const Core = require('./Core');
const Thread = require('./Thread');
const InstanceBase = require('./InstanceBase');
const InstanceRoute = require('./InstanceRoute');

/**
 * Exports the classes related to a multi-threaded environment, providing the necessary components to build and manage a cluster of cores and threads.
 * @class InstanceManager
 */
class InstanceManager {
    /**
     * Manages a cluster of cores and threads.
     * @class Cluster
     */
    static Cluster = Cluster;

    /**
     * Represents the core unit in the cluster, managing threads and routing messages.
     * @class Core
     */
    static Core = Core;

    /**
     * Represents a thread, handling message passing and thread-specific logic.
     * @class Thread
     */
    static Thread = Thread;

    /**
     * Serves as the base class for instances, providing common functionality.
     * @class InstanceBase
     */
    static InstanceBase = InstanceBase;

    /**
     * Manages routing for instances within the cluster.
     * @class InstanceRoute
     */
    static InstanceRoute = InstanceRoute;
}

module.exports = InstanceManager;
