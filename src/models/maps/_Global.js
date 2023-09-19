const ValidateSchema = require('../../validation/validateSchema');
const CRUD = require('../../services/database/crud');
const { isObjectID } = require('../../helpers/database/relationalFields');
const { increaseDocProp } = require('../../helpers/database/dbHelpers');

class GlobalMap extends ValidateSchema {
    constructor(setup, parent) {
        super(setup.validationRules || {});
        if (isObjectID(setup)) return;

        const User = require('@models/collections/User');
        const { _id, index, author, cod, createdAt, modifiedAt, collectionName} = setup || {};

        try {
            this.collectionName = collectionName;
            this._id = _id && _id.toString();
            this.index = index;
            this.author = author || User.currentUser();
            this.cod = cod;
            this.createdAt = createdAt && new Date(createdAt).toLocaleString();
            this.modifiedAt = modifiedAt && new Date(modifiedAt).toLocaleString();
    
            this.getParent = () => parent;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    get parent() {
        return this.getParent();
    }

    get stringIndex() {
        return String(this.index);
    }

    async getCurrentUser() {
        const User = require('@models/collections/User');
        const UID = User.currentUser();
        const user = await CRUD.getDoc({
            collectionName: 'users',
            filter: UID
        }).initialize();

        return user;
    }

    async saveDB(collectionName) {
        try {
            const created = await CRUD.create(collectionName || this.collectionName, {...this});

            if (created instanceof Error.Log) {
                return new Error.Log(created);
            }

            if (created) {
                Object.entries(created.initialize() || {}).map(([key, value]) => {
                    this[key] = value;
                });
    
                return this;
            }

            throw new Error.Log(created);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async loadDB(collectionName) {
        if (!collectionName) {
            collectionName = this.collectionName;
        }

        try {
            const loaded = await CRUD.getDoc({collectionName, filter: this._id}).defaultPopulate();
            
            if (loaded instanceof Error.Log) {
                throw new Error.Log(loaded);
            }

            return loaded.initialize();
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async updateDB({collectionName, filter, data}) {
        const collection = collectionName || this.collectionName;

        try {
            if (!collection) throw new Error.Log('database.missing_params', 'collectionName', '_Global.updateDB');

            const loaded = await CRUD.update({collectionName: collection, filter: filter || this._id, data, options: {returnDocs: true} });
            if (loaded instanceof Error.Log) {
                throw new Error.Log(loaded);
            }

            return loaded.initialize();
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async deleteDB(collectionName, filter) {
        try {
            const deleted = await CRUD.del({
                collectionName: collectionName || this.collectionName,
                filter: filter || this._id
            });

            if (deleted instanceof Error.Log) {
                throw deleted;
            }

            return deleted;
        } catch (err) { 
            throw new Error.Log(err);
        }
    }

    async increaseProp(propKey, value) {
        if (!propKey) throw new Error.Log()
        const increaseAmount = value || 1;
        const increaseValue = {[propKey]: increaseAmount};

        try {
            if (!this.collectionName || !propKey) {
                return new Error.Log('database.missing_params', ['this.collectionName', 'propKey'], '_Global.updateDB')
            }

            const increased = await increaseDocProp(this.collectionName, {_id: this._id}, increaseValue);
            if (increased instanceof Error.Log) {
                return increased;
            }

            increased[propKey] = increased[propKey] + increaseAmount;
            return increased;
        } catch (err) {
            throw new Error.Log('helpers.increase_doc_prop', this.collectionName, this._id, increaseValue);
        }
    }

    async jiraTransitionStatus(event) {
        if (!this.jiraIssue) return;

        try {
            for (let user of this.assignedUsers) {
                const jiraUpdated = await user.jiraConnect.transitionIssue(this.jiraIssue.key, event);

                if (jiraUpdated instanceof Error.Log) {
                    throw jiraUpdated
                }

                return jiraUpdated;
            };
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = GlobalMap;
