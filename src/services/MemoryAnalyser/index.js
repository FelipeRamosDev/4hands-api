const MemoryData = require('./MemoryData');
const MemoryMonitor = require('./MemoryMonitor');
const crypto = require('crypto');

/**
 * Class representing a MemoryAnalyser.
 */
class MemoryAnalyser {
    /**
     * Create a MemoryAnalyser.
     * @param {Object} options - The options for the MemoryAnalyser.
     * @param {string} options.sizeUnit - 'kb' | 'mb' | 'gb'
     */
    constructor(options) {
        try {
            const { sizeUnit } = Object(options);

            this.sizeUnit = sizeUnit;
            this.monitors = [];
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Get information about the memory usage.
     * @return {Object} The memory usage information.
     */
    getInfo() {
        return {
            memory: process.memoryUsage(),
            heapUsed: this.heapUsed(),
            heapTotal: this.heapTotal()
        }
    }

    /**
     * Get the used heap memory.
     * @return {MemoryData} The used heap memory.
     */
    heapUsed() {
        const { heapUsed } = process.memoryUsage();
        const value = new MemoryData(heapUsed);

        value.setSizeUnit(this.sizeUnit);
        return value;
    }

    /**
     * Get the total heap memory.
     * @return {MemoryData} The total heap memory.
     */
    heapTotal() {
        const { heapTotal } = process.memoryUsage();
        const value = new MemoryData(heapTotal);

        value.setSizeUnit(this.sizeUnit);
        return value;
    }

    /**
     * Create a memory monitor.
     * @param {string} id - The id of the monitor.
     * @param {number} loopInterval - The loop interval of the monitor.
     * @return {MemoryMonitor} The created memory monitor.
     */
    createMonitor(id, loopInterval) {
        if (!isNaN(id)) {
            id = crypto.randomUUID().toString('hex');
        }
        
        const monitor = new MemoryMonitor({ id, loopInterval }, this);
        this.monitors.push(monitor);
        return monitor;
    }

    /**
     * Print the memory information.
     * @param {string} label - The label for the print.
     * @param {MemoryMonitor} monitor - The monitor to print.
     */
    printInfo(label, monitor) {
        const { heapUsed, heapTotal } = this.getInfo();
        const time = new Date();
        const valuesToPrint = {
            heapUsed: heapUsed.displayValue(this.sizeUnit),
            heapTotal: heapTotal.displayValue(this.sizeUnit),
            heapUsedAvg: monitor.heapUsedAvg(),
            heapTotalAvg: monitor.heapTotalAvg()
        };

        console.log('\n-----------------------------------------------------------');
        if (label) {
            console.log('  ' + label.toUpperCase());
            console.log('  ' + time.toLocaleString());
            console.log('-----------------------------------------------------------');
        }

        console.log('  Heap Used:', valuesToPrint.heapUsed);
        console.log('  Heap Total:', valuesToPrint.heapTotal);
        console.log('  Average Heap Used:', valuesToPrint.heapUsedAvg.toFixed(3));
        console.log('  Average Heap Total:', valuesToPrint.heapTotalAvg.toFixed(3));
        console.log('-----------------------------------------------------------');
    }
}

module.exports = MemoryAnalyser;
