const Cluster = require('./Cluster');
const Core = require('./Core');
const Thread = require('./Thread');
const InstanceBase = require('./InstanceBase');
const InstanceRoute = require('./InstanceRoute');

/**
 * Exports the classes related to a multi-threaded environment, providing the necessary components to build and manage a cluster of cores and threads.
 */
module.exports = {
    Cluster,      // Manages a cluster of cores and threads.
    Core,         // Represents the core unit in the cluster, managing threads and routing messages.
    Thread,       // Represents a thread, handling message passing and thread-specific logic.
    InstanceBase, // Serves as the base class for instances, providing common functionality.
    InstanceRoute // Manages routing for instances within the cluster.
};
