const CRUD = require('../../services/database/crud');
const { isObjectID } = require('../../helpers/database/relationalFields');

/**
 * Represents a global map in the application, extending the ValidateSchema class.
 * @module GlobalMap
 * @namespace Models
 */
class GlobalMap {
    /**
     * Creates a new instance of the GlobalMap class.
     * @param {Object} setup - The setup object.
     * @param {Object} parent - The parent object.
     * @throws {Error} If the creation of GlobalMap fails.
     */
    constructor(setup, parent) {
        const { _id, index, author, cod, createdAt, modifiedAt, collectionName } = setup || {};
        if (isObjectID(setup)) return;

        const User = require('@models/collections/User');

        try {
            this.getParent = () => parent;

            this.collectionName = collectionName;
            this._id = _id && _id.toString();
            this.UID = this._id || setup.UID?.toString();
            this.index = index;
            this.author = author || User.currentUser();
            this.cod = cod;
            this.createdAt = createdAt && new Date(createdAt).toLocaleString();
            this.modifiedAt = modifiedAt && new Date(modifiedAt).toLocaleString();
            this.isConstructed = true;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Returns the parent object of the GlobalMap instance.
     * @returns {Object} - The parent object.
     */
    get parent() {
        return this.getParent();
    }

    /**
     * Returns the string representation of the index property.
     * @returns {string} - The string representation of the index property.
     */
    get stringIndex() {
        return String(this.index);
    }

    /**
     * Asynchronously retrieves the current user associated with the GlobalMap instance.
     * @returns {Promise<Object>} - A promise resolving to the current user object.
     * @throws {Error} If there is an error during the retrieval process.
     */
    async getCurrentUser() {
        const User = require('@models/collections/User');
        const UID = User.currentUser();
        const user = await CRUD.getDoc({
            collectionName: 'users',
            filter: UID
        }).initialize();

        return user;
    }

    /**
     * Asynchronously saves the GlobalMap instance to the database.
     * @param {string} collectionName - The name of the collection to save the instance.
     * @returns {Promise<GlobalMap>} - A promise resolving to the saved GlobalMap instance.
     * @throws {Error} If there is an error during the saving process.
     */
    async saveDB(collectionName) {
        const CRUDDB = require('@CRUD');

        try {
            const created = await CRUDDB.create(collectionName || this.collectionName, {...this});

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

    /**
     * Asynchronously loads the GlobalMap instance from the database.
     * @param {string} collectionName - The name of the collection to load the instance.
     * @returns {Promise<GlobalMap>} - A promise resolving to the loaded GlobalMap instance.
     * @throws {Error} If there is an error during the loading process.
     */
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

    /**
     * Asynchronously updates the GlobalMap instance in the database.
     * @param {Object} updateParams - The update parameters including collectionName, filter, and data.
     * @returns {Promise<GlobalMap>} - A promise resolving to the updated GlobalMap instance.
     * @throws {Error} If there is an error during the update process.
     */
    async updateDB({collectionName, filter, data}) {
        const crud = require('../../services/database/crud');
        const collection = collectionName || this.collectionName;

        try {
            if (!collection) throw new Error.Log('database.missing_params', 'collectionName', '_Global.updateDB');

            const loaded = await crud.update({collectionName: collection, filter: filter || this.UID || this._id, data: data || {...this}, options: {returnDocs: true} });
            if (loaded instanceof Error.Log) {
                throw new Error.Log(loaded);
            }

            return loaded.initialize();
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Asynchronously deletes the GlobalMap instance from the database.
     * @param {string} collectionName - The name of the collection to delete the instance.
     * @param {Object} filter - The filter object for deletion.
     * @returns {Promise<Object>} - A promise resolving to the deletion result.
     * @throws {Error} If there is an error during the deletion process.
     */
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

    /**
     * Asynchronously increases a property value in the GlobalMap instance.
     * @param {string} propKey - The property key to increase.
     * @param {number} value - The value by which the property should be increased (default is 1).
     * @returns {Promise<GlobalMap>} - A promise resolving to the updated GlobalMap instance.
     * @throws {Error} If there is an error during the property increase process.
     */
    async increaseProp(propKey, value) {
        if (!propKey) throw new Error.Log();
        const { increaseDocProp } = require('../../helpers/database/dbHelpers');
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

    /**
     * Encrypts and sets the specified field with the provided value. If the field does not have a current encrypted value,
     * it creates a new SafeValue instance and updates the field in the database. If the field already has an encrypted value,
     * it updates the existing SafeValue instance with the new value.
     *
     * @param {string} fieldName - The name of the field to be encrypted and updated.
     * @param {string} value - The raw value to be encrypted and set.
     * @returns {Promise<Object>} A Promise that resolves to an object containing success status, message, and data.
     * @throws {Error.Log} If there is an error during encryption, database update, or if a required value is missing.
     * @async
     */
    async setEncryptField(fieldName, value) {
        const SafeValue = require('4hands-api/src/models/collections/SafeValue');
        const currValue = this[fieldName];

        if (!value) {
            throw new Error.Log({ name: `It's required to have a value to proceed on setting a safe value!`});
        }

        if (!currValue || currValue.isEmpty) {
            const newSafeValue = await SafeValue.createEncrypt(value);

            const updated = await this.updateDB({
                data: { [fieldName]: newSafeValue.id }
            });

            if (!updated || updated instanceof Error.Log) {
                throw new Error.Log(updated);
            } else {
                return { success: true, message: 'New safe value created!', data: newSafeValue };
            }
        } else {
            const updated = await currValue.setEncrypted(value);

            if (!updated || updated instanceof Error.Log) {
                throw new Error.Log(updated);
            } else {
                return { success: true, message: 'SafeValue updated!', data: updated };
            }
        }
    }

    async createCache(data) {
        try {
            const created = await API.redisServ.createDoc({ collection: this.collectionName, uid: this.UID, data: data || {...this} });
            return created;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async getCache() {
        try {
            const cache = await API.redisServ.getDoc({ collection: this.collectionName, uid: this.UID });
            return cache;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async updateCache(data) {
        try {
            const updated = await API.redisServ.updateDoc({ collection: this.collectionName, uid: this.UID || this._id, data: data || {...this} });
            return updated;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async clearCache() {
        try {
            const deleted = await API.redisServ.deleteDoc({ collection: this.collectionName, uid: this.UID });
            return deleted;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static async createDocCache(collection, uid) {
        const { CRUD } = require('4hands-api');

        try {
            const docQuery = CRUD.getDoc({ collectionName: collection, filter: uid });
            let docResult;

            if (docQuery.defaultPopulate) {
                docResult = await docQuery.defaultPopulate();
            } else {
                docResult = await docQuery.exec();
            }

            const doc = docResult.initialize();
            const cached = await doc.createCache();
            return cached;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static async getCache(collection, uid) {
        try {
            const cacheDoc = await API.redisServ.getDoc({ collection, uid });
            return cacheDoc;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = GlobalMap;
