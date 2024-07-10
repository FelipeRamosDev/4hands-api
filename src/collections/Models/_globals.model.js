class _Global {
    /**
     * Constructs a new _Global instance.
     * @param {Object} setup - The setup object containing initial values for the instance.
     * @param {Object} parent - The parent object of this instance.
     */
    constructor (setup, parent) {
        const { UID, _id, id, index, author, cod, createdAt, modifiedAt, collection } = Object(setup);
        this._parent = () => parent;

        this._collectionName = collection?.collectionName;
        this._id = _id;
        this.id = id;
        this._UID = UID;
        this.index = index;
        this.author = author;
        this.cod = cod;
        this.createdAt = createdAt && new Date(createdAt);
        this.modifiedAt = modifiedAt && new Date(modifiedAt);

        if (typeof setup === 'object') {
            const obj = this.getCollection(setup?.collection?.collectionName);
            if (!obj) return;

            obj.fieldsSet.map(field => {
                const descriptor = Object.getOwnPropertyDescriptor(this, field.fieldName);
                if (descriptor && typeof descriptor.get === 'function') {
                    return;
                }

                let value = setup[field.fieldName];

                if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                    value._parent = () => this;
                }

                if (Array.isArray(value)) {
                    value = value.map(item => {
                        if (typeof value === 'object' && !Array.isArray(value)) {
                            item._parent = () => this;
                        }

                        return item;
                    });
                }

                try {
                    this[field.fieldName] = value;
                } catch (err) {
                    return;
                }
            });
        }
    }

    /**
     * Retrieves the unique identifier (UID) of the instance.
     * @readonly
     * @returns {string} - The UID of the instance.
     */
    get UID() {
        if (typeof this._UID === 'string') {
            return this._UID;
        }

        if (this.id instanceof Buffer) {
            return this.id.toString('hex');
        }

        if (typeof this.id === 'string') {
            return this.id;
        }

        if (typeof this._id?.toString === 'function') {
            return this._id.toString();
        }
    }

    /**
     * Retrieves the parent object of the instance.
     * @readonly
     * @returns {Object} - The parent object.
     */
    get parent() {
        if (this._parent) {
            return this._parent();
        }
    }

    /**
     * Retrieves the collection name associated with the instance.
     * @readonly
     * @returns {string} - The collection name.
     */
    get collectionName() {
        if (this._collectionName) {
            return this._collectionName;
        } else {
            return this.collection?.collectionName;
        }
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
     * Retrieves the collection object for a given collection name.
     * @param {string} collectionName - The name of the collection.
     * @returns {Object} - The collection object.
     */

    getCollection(collectionName) {
        return global._4handsAPI?.collections?.getCollection(collectionName || this.collectionName);
    }

    /**
     * Converts the instance to a model instance.
     * @param {Function} OtherModel - The model constructor to convert to.
     * @returns {Object} - The model instance.
     */
    toModel(OtherModel) {
        const collection = this.getCollection();

        if (collection) {
            const { DefaultModel, CustomModel } = Object(collection);
            const parent = (typeof this._parent === 'function') ? this._parent() : undefined;

            const Model = OtherModel || CustomModel || DefaultModel;
            if (Model) {
                return new Model(this, parent);
            }
        }
    }

    /**
     * Initializes the instance by converting it to a custom model if available.
     * @returns {Object} - The initialized model instance.
     * @throws {Error} - If an error occurs during initialization.
     */
    initialize() {
        try {
            const CustomModel = this.CustomModel || this?.schema?.statics?.CustomModel;
            return this.toModel(CustomModel);
        } catch(err) {
            throw logError(err);
        }
    }

    /**
     * Asynchronously populates the instance with default values.
     * @returns {Promise<Object>} - The populated document.
     * @throws {Error} - If an error occurs during population.
     */
    async defaultPopulate() {
        const CRUD = global._4handsAPI?.CRUD;

        try {
            const docQuery = CRUD.getDoc({collectionName: this.collection.collectionName, filter: this.id });
            
            if (docQuery.defaultPopulate) {
                const docPopulated = await docQuery.defaultPopulate();
                if (docPopulated.error) {
                    throw docPopulated;
                }

                if (docPopulated) {
                    return docPopulated;
                } else {
                    return null;
                }
            } else {
                return logError({
                    name: 'MONGOOSE-QUERY-NOT-FOUND',
                    message: `The mongoose custom query "defaultPopulate" don't exist!`
                });
            }
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Asynchronously retrieves the current user associated with the GlobalMap instance.
     * @returns {Promise<Object>} - A promise resolving to the current user object.
     * @throws {Error} If there is an error during the retrieval process.
     */
    async getCurrentUser() {
        const CRUD = global._4handsAPI?.CRUD;
        const User = require('./users.model');
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
        const SafeValue = require('./safe_values.model');

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

    /**
     * Creates a cache for the current instance in Redis.
     * @param {Object} data - The data to cache. Defaults to the current instance data if not provided.
     * @returns {Promise<Object>} - The created cache document.
     * @throws {Error} - If there is an error during the cache creation process.
     */
    async createCache(data) {
        const API = global._4handsAPI?.API;

        try {
            const created = await API.Redis.createDoc({ collection: this.collectionName, uid: this.UID, data: data || {...this} });
            return created;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Retrieves the cache for the current instance from Redis.
     * @returns {Promise<Object>} - The cached document.
     * @throws {Error} - If there is an error during the cache retrieval process.
     */
    async getCache() {
        const API = global._4handsAPI?.API;

        try {
            const cache = await API.Redis.getDoc({ collection: this.collectionName, uid: this.UID });
            return cache;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Updates the cache for the current instance in Redis.
     * @param {Object} data - The data to update in the cache. Defaults to the current instance data if not provided.
     * @returns {Promise<Object>} - The updated cache document.
     * @throws {Error} - If there is an error during the cache update process.
     */
    async updateCache(data) {
        const API = global._4handsAPI?.API;

        try {
            const updated = await API.Redis.updateDoc({ collection: this.collectionName, uid: this.UID || this._id, data: data || {...this} });
            return updated;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Clears the cache for the current instance in Redis.
     * @returns {Promise<Object>} - The deleted cache document.
     * @throws {Error} - If there is an error during the cache deletion process.
     */
    async clearCache() {
        const API = global._4handsAPI?.API;

        try {
            const deleted = await API.Redis.deleteDoc({ collection: this.collectionName, uid: this.UID });
            return deleted;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Creates a cache for a document in a specified collection.
     * @param {string} collection - The name of the collection.
     * @param {string} uid - The unique identifier of the document.
     * @returns {Promise<Object>} - The created cache document.
     * @throws {Error} - If there is an error during the cache creation process.
     */
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

    /**
     * Retrieves the cache for a document in a specified collection.
     * @param {string} collection - The name of the collection.
     * @param {string} uid - The unique identifier of the document.
     * @returns {Promise<Object>} - The cached document.
     * @throws {Error} - If there is an error during the cache retrieval process.
     */
    static async getCache(collection, uid) {
        const API = global._4handsAPI?.API;

        try {
            const cacheDoc = await API.Redis.getDoc({ collection, uid });
            return cacheDoc;
        } catch (err) {
            throw logError(err);
        }
    }
}

module.exports = _Global;
