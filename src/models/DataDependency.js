const CRUD = require('@CRUD');

class DataDependency {
    constructor(setup, parent) {
        try {
            const { name, type, collectionName, filter } = Object(setup);

            this.name = name;
            this.type = type;
            this.collectionName = collectionName;
            this.filter = filter;

            this._parent = () => parent;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    get parent() {
        return this._parent();
    }

    addSocketUpdateListener(socketConnection, subsUID) {
        const self = this;
        process.on(`socket:update:${this.collectionName}:${JSON.stringify(this.filter)}`, (ev) => self.updateComponentHandler.call(this, ev, socketConnection, subsUID));
    }
    
    async updateComponentHandler(ev, socketConnection, subsUID) {
        try {
            const newValue = await this.load();
            this.parent.updateMerge({[this.name]: newValue});

            const htmlString = this.parent.renderToString();
            socketConnection.socket.emit('subscribe:component:data:' + subsUID, htmlString.toSuccess());
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async load() {
        try {
            if (this.type === 'doc') {
                const docQuery = await CRUD.getDoc({ collectionName: this.collectionName, filter: this.filter }).defaultPopulate();

                if (docQuery instanceof Error.Log) {
                    return docQuery;
                }

                this.value = docQuery.initialize();
                return this.value;
            }

            if (this.type === 'list') {
                const queryList = await CRUD.query({ collectionName: this.collectionName, filter: this.filter }).defaultPopulate();

                if (queryList instanceof Error.Log || !Array.isArray(queryList)) {
                    return queryList;
                }

                this.value = queryList.map(item => item.initialize());
                return this.value;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = DataDependency;
