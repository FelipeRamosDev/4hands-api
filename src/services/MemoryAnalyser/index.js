const MemoryData = require('./MemoryData');
const MemoryMonitor = require('./MemoryMonitor');
const crypto = require('crypto');

class MemoryAnalyser {
    constructor(options) {
        try {
            const { sizeUnit } = Object(options);

            this.sizeUnit = sizeUnit;
            this.monitors = [];
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    getInfo() {
        return {
            memory: process.memoryUsage(),
            heapUsed: this.heapUsed(),
            heapTotal: this.heapTotal()
        }
    }

    heapUsed() {
        const { heapUsed } = process.memoryUsage();
        const value = new MemoryData(heapUsed);

        value.setSizeUnit(this.sizeUnit);
        return value;
    }

    heapTotal() {
        const { heapTotal } = process.memoryUsage();
        const value = new MemoryData(heapTotal);

        value.setSizeUnit(this.sizeUnit);
        return value;
    }

    createMonitor(id, interval = 3000) {
        const loop = setInterval(() => {
            this.printInfo(id);
        }, interval);

        if (!isNaN(id)) {
            id = crypto.randomUUID().toString('hex');
        }
        
        const monitor = new MemoryMonitor(id, loop);
        this.monitors.push(monitor);
        return monitor;
    }

    printInfo(label) {
        const { heapUsed, heapTotal } = this.getInfo();
        const time = new Date();

        console.log('\n-----------------------------------------------------------');
        if (label) {
            console.log('  ' + label.toUpperCase());
            console.log('  ' + time.toLocaleString());
            console.log('-----------------------------------------------------------');
        }

        console.log('  Heap Used:', heapUsed.displayValue(this.sizeUnit));
        console.log('  Heap Total:', heapTotal.displayValue(this.sizeUnit));
        console.log('-----------------------------------------------------------');
    }
}

module.exports = MemoryAnalyser;
