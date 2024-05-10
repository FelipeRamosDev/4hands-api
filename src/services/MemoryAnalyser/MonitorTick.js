/**
 * Class representing a MonitorTick.
 */
class MonitorTick {
    /**
     * Create a MonitorTick.
     * @param {number} value - The value of the monitor tick.
     */
    constructor(value) {
        this.value = value;
        this.timestamp = Date.now();
    }
}

module.exports = MonitorTick;
