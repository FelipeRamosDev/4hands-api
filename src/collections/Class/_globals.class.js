class _Global {
    constructor (setup, collectionName) {
        const Collection = global._4handsAPI?.getCollection(collectionName);
        const _collectionName = collectionName || setup?.collection?.collectionName;

        this.isModel = true;

        if (Collection && setup) {
            Collection.fieldsSet.map(field => (this[field.fieldName] = setup[field.fieldName]));
        }

        if (_collectionName) {
            this._collectionName = _collectionName;
        }

        delete this.toModel;
    }
    
    get collectionName() {
        if (this._collectionName) {
            return this._collectionName;
        } else if (this.collection) {
            return this.collection?.collectionName;
        }
    }

    initialize() {
        try {
            const Model = this.BSModel || this?.schema?.statics?.BSModel;

            if (Model) {
                const builded = new Model(this.toObject());
                return builded;
            } else {
                return this;
            }
        } catch(err) {
            throw logError(err);
        }
    }

    toModel(collection) {
        if (!this.isModel) {
            return new _Global(this, collection);
        }
    }

    get UID() {
        return this.id;
    }

    /**
     * @readonly
     * @returns {boolean} Return if the document is fully loaded
     */
    get isComplete() {
        return true;
    }

    /**
     * @readonly
     * @returns {string[]} The fields that needs to save as encrypted buffer.
     */
    get encryptedFields() {
        const result = [];

        Object.keys(this.schema.obj).map(key => {
            const curr = this.schema.obj[key];

            if (curr.isEncrypt) {
                result.push(key);
            }
        });

        return result;
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
        const User = require('../../models/collections/User');
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
        const CRUD = global._4handsAPI?.CRUD;

        try {
            const created = await CRUD.create(collectionName || this.collectionName, {...this});

            if (created.error) {
                return logError(created);
            }

            if (created) {
                Object.entries(created.initialize() || {}).map(([key, value]) => {
                    this[key] = value;
                });
    
                return this;
            }

            throw logError(created);
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Asynchronously loads the GlobalMap instance from the database.
     * @param {string} collectionName - The name of the collection to load the instance.
     * @returns {Promise<GlobalMap>} - A promise resolving to the loaded GlobalMap instance.
     * @throws {Error} If there is an error during the loading process.
     */
    async loadDB(collectionName) {
        const CRUD = global._4handsAPI?.CRUD;
        if (!collectionName) {
            collectionName = this.collectionName;
        }

        try {
            const loaded = await CRUD.getDoc({collectionName, filter: this._id}).defaultPopulate();
            
            if (loaded.error) {
                throw logError(loaded);
            }

            return loaded.initialize();
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Asynchronously updates the GlobalMap instance in the database.
     * @param {Object} updateParams - The update parameters including collectionName, filter, and data.
     * @returns {Promise<GlobalMap>} - A promise resolving to the updated GlobalMap instance.
     * @throws {Error} If there is an error during the update process.
     */
    async updateDB({collectionName, filter, data}) {
        const CRUD = global._4handsAPI?.CRUD;
        const collection = collectionName || this.collectionName;

        try {
            if (!collection) throw logError('database.missing_params', 'collectionName', '_Global.updateDB');

            const filterParse = filter || this.UID || this._id;
            const loaded = await CRUD.update({
                collectionName: collection,
                filter: filterParse,
                data: data || { ...this },
                options: { returnDocs: true }
            });
            if (loaded.error) {
                throw logError(loaded);
            }

            return loaded.initialize();
        } catch (err) {
            throw logError(err);
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
        const CRUD = global._4handsAPI?.CRUD;

        try {
            const deleted = await CRUD.del({
                collectionName: collectionName || this.collectionName,
                filter: filter || this._id
            });

            if (deleted.error) {
                throw deleted;
            }

            return deleted;
        } catch (err) { 
            throw logError(err);
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
        if (!propKey) throw logError();
        const { increaseDocProp } = require('../../helpers/database/dbHelpers');
        const increaseAmount = value || 1;
        const increaseValue = {[propKey]: increaseAmount};

        try {
            if (!this.collectionName || !propKey) {
                return logError('database.missing_params', ['this.collectionName', 'propKey'], '_Global.updateDB')
            }

            const increased = await increaseDocProp(this.collectionName, {_id: this._id}, increaseValue);
            if (increased.error) {
                return increased;
            }

            increased[propKey] = increased[propKey] + increaseAmount;
            return increased;
        } catch (err) {
            throw logError('helpers.increase_doc_prop', this.collectionName, this._id, increaseValue);
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
        const SafeValue = require('../../models/collections/SafeValue');

        if (!value) {
            throw logError({ name: `It's required to have a value to proceed on setting a safe value!`});
        }

        const newSafeValue = await SafeValue.createEncrypt(value);
        const updated = await this.updateDB({
            data: { [fieldName]: newSafeValue.id }
        });

        if (!updated || updated.error) {
            throw logError(updated);
        }

        return { success: true, message: 'New safe value created!', data: newSafeValue };
    }

    async createCache(data) {
        const Redis = global._4handsAPI?.Redis;

        try {
            const created = await Redis.createDoc({ collection: this.collectionName, uid: this.UID, data: data || this.toObject() });
            return created;
        } catch (err) {
            throw logError(err);
        }
    }

    async getCache() {
        const Redis = global._4handsAPI?.Redis;

        try {
            const cache = await Redis.getDoc({ collection: this.collectionName, uid: this.UID });
            return cache;
        } catch (err) {
            throw logError(err);
        }
    }

    async updateCache(data) {
        const Redis = global._4handsAPI?.Redis;

        try {
            const updated = await Redis.updateDoc({ collection: this.collectionName, uid: this.UID || this._id, data: data || {...this} });
            return updated;
        } catch (err) {
            throw logError(err);
        }
    }

    async clearCache() {
        const Redis = global._4handsAPI?.Redis;

        try {
            const deleted = await Redis.deleteDoc({ collection: this.collectionName, uid: this.UID });
            return deleted;
        } catch (err) {
            throw logError(err);
        }
    }

    static async createDocCache(collection, uid) {
        const CRUD = global._4handsAPI?.CRUD;

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
            throw logError(err);
        }
    }

    static async getCache(collection, uid) {
        const Redis = global._4handsAPI?.Redis;

        try {
            const cacheDoc = await Redis.getDoc({ collection, uid });
            return cacheDoc;
        } catch (err) {
            throw logError(err);
        }
    }
}

module.exports = _Global;
