class MemoryMonitor {
    constructor(id, loop) {
        this.id = id;
        this.loop = loop;
    }

    close() {
        this.loop.close();
    }
}

module.exports = MemoryMonitor;
