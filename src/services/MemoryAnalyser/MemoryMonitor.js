const MonitorTick = require('./MonitorTick');

/**
 * Class representing a MemoryMonitor.
 */
class MemoryMonitor {
    /**
     * Create a MemoryMonitor.
     * @param {Object} setup - The setup for the MemoryMonitor.
     * @param {Function} analyser - The analyser function for the MemoryMonitor.
     */
    constructor(setup, analyser) {
        const { id, loopInterval } = Object(setup);

        this.id = id;
        this.loop = this.setLoop(loopInterval);
        this.heapUsedTicks = [];
        this.heapTotalTicks = [];

        this._analyser = () => analyser;
    }

    /**
     * Get the analyser function.
     * @return {Function} The analyser function.
     */
    get analyser() {
        return this._analyser();
    }

    /**
     * Set the loop for the MemoryMonitor.
     * @param {number} interval - The interval for the loop.
     * @return {Object} The loop.
     */
    setLoop(interval = 3000) {
        return setInterval(() => {
            const { heapUsed, heapTotal } = this.analyser.getInfo();

            this.heapUsedTicks.push(new MonitorTick(heapUsed));
            this.heapTotalTicks.push(new MonitorTick(heapTotal));
            this.analyser.printInfo(this.id, this);
        }, interval);
    }

    /**
     * Get the average used heap memory.
     * @param {number} interval - The interval for the average calculation.
     * @return {number} The average used heap memory.
     */
    heapUsedAvg(interval) {
        const ticks = this.filterTicks(this.heapUsedTicks, interval);
        const tickSum = this.tickSum(ticks);

        return tickSum / ticks.length;
    }

    /**
     * Get the average total heap memory.
     * @param {number} interval - The interval for the average calculation.
     * @return {number} The average total heap memory.
     */
    heapTotalAvg(interval) {
        const ticks = this.filterTicks(this.heapTotalTicks, interval);
        const tickSum = this.tickSum(ticks);

        return tickSum / ticks.length;
    }

    /**
     * Filter the ticks based on a specific interval.
     * @param {Array} ticks - The ticks to filter.
     * @param {number} interval - The interval for the filter.
     * @return {Array} The filtered ticks.
     */
    filterTicks(ticks, interval = 1) {
        let limit = Date.now() - (interval * 3600000);
        return ticks.filter(item => item.timestamp > limit);
    }

    /**
     * Get the sum of the ticks.
     * @param {Array} ticks - The ticks to sum.
     * @return {number} The sum of the ticks.
     */
    tickSum(ticks) {
        return ticks.reduce((prev, curr) => (prev + curr?.value?.value), 0);
    }

    /**
     * Close the loop.
     */
    close() {
        this.loop.close();
    }
}

module.exports = MemoryMonitor;
