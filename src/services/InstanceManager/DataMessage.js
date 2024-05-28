class DataMessage {
    constructor(setup) {
        const { target = '/', from, data } = Object(setup);

        if (!from || typeof from !== 'string') {
            throw new Error('The "setup.from" param is required and it needs to be a string!');
        }

        if (typeof data !== 'object' || Array.isArray(data) || data === null) {
            throw new Error('The "setup.data" param is required and it needs to be a valid object!');
        }

        this.target = target;
        this.from = from;
        this.data = data;

        if (this.target === '/') {
            this.isToMaster = true
        }
    }

    get targetArray() {
        if (this.target === '/') {
            return [];
        }

        const firstTargetChar = this.target[0];
        const parsedString = (firstTargetChar === '/') ? this.target.replace('/', '') : this.target;
        return parsedString.split('/');
    }

    get parseStringPath() {
        if (this.target === '/') {
            return {};
        }

        const [ core, thread ] = this.targetArray;
        return { core, thread };
    }

    get targetCore() {
        const { core } = this.parseStringPath;
        return core;
    }

    get targetThread() {
        const { thread } = this.parseStringPath;
        return thread;
    }

    toObject() {
        return { ...this };
    }

    isCoreMatch(currentCore) {
        return Boolean(this.targetCore === currentCore);
    }

    isArrived(currentPath) {
        return Boolean(currentPath === this.target);
    }

    static build(data) {
        if (typeof data !== 'object' || Array.isArray(data) || data === null) {
            return;
        }

        try {
            const dataMessage = new DataMessage(data);
            return dataMessage;
        } catch (err) {
            return;
        }
    }
}

module.exports = DataMessage;
