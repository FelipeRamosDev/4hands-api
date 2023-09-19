function buildPromise(docsToUpdate, currFieldSchema, relatedUID, arrayAction, onlyAct) {
    if (!currFieldSchema.refConfig) return;

    const currType = currFieldSchema.type;
    const {relatedField, type} = currFieldSchema.refConfig;
    const isCurrentAnArray = (Array.isArray(currType) && currType.length && currType[0].schemaName === 'ObjectId');
    const isCurrentAnObjectId = (currType.schemaName === 'ObjectId');
    const isRelatedAnArray = (type === 'array-oid');
    const isRelatedAnObjectId = (type === 'ObjectId');
    let params;

    if (isCurrentAnArray && !docsToUpdate.length) {
        return;
    }

    if (isCurrentAnArray && isRelatedAnArray) {
        const toUpdate = new Promise((resolve, reject) => {
            params = [
                { _id: { $in: docsToUpdate } },
                { [arrayAction]: { [relatedField]: relatedUID }, onlyAct },
                (err, result) => {
                    if (err) throw reject(new Error.Log(err));
                    return resolve(result);
                }
            ];

            if (this.$op === 'save') {
                this.model(currFieldSchema.ref).updateMany(...params);
            } else {
                this.model.db.model(currFieldSchema.ref).updateMany(...params);
            }
        });

        return toUpdate;
    }

    if (isCurrentAnArray && isRelatedAnObjectId) {
        const toUpdate = new Promise((resolve, reject) => {
            params = [
                { _id: { $in: docsToUpdate } },
                { [relatedField]: relatedUID, onlyAct },
                (err, result) => {
                    if (err) return reject(new Error.Log(err));
                    return resolve(result);
                }
            ];

            if (this.$op === 'save') {
                this.model(currFieldSchema.ref).updateMany(...params);
            } else {
                this.model.db.model(currFieldSchema.ref).updateMany(...params);
            }
        });

        return toUpdate;
    }

    if (isCurrentAnObjectId && isRelatedAnArray) {
        params = [
            { _id: docsToUpdate },
            {[arrayAction]: { [relatedField]: relatedUID }, onlyAct}
        ];
    }

    if (isCurrentAnObjectId && isRelatedAnObjectId) {
        params = [
            { _id: docsToUpdate },
            { [relatedField]: relatedUID, onlyAct }
        ];
    }

    if (this.$op === 'save') {
        return this.model(currFieldSchema.ref).updateOne(...params);
    } else {
        return this.model.db.model(currFieldSchema.ref).updateOne(...params);
    }
}

async function onCreate() {
    const promises = [];

    try {
        // Iterate each field of the current document being created
        Object.entries(this.schema.obj).map(([key, value]) => {
            if (!value.refConfig || !this[key]) return;

            const toUpdate = buildPromise.call(this,
                this[key],
                value,
                this.id,
                '$addToSet',
                'create'
            );
            promises.push(toUpdate);
        });
    
        const updated = await Promise.all(promises);
        return updated;
    } catch(err) {
        throw new Error.Log(err);
    }
}

async function onUpdate() {
    try {
        const schemaObj = this.schema.obj;
        const promises = [];

        Object.entries(this._update).map(([key, value]) => {
            if (key === '$addToSet' || key === '$pull') {
                Object.entries(value).map(([$key, $value]) => {
                    const currFieldSchema = schemaObj[$key];
                    const toUpdate = buildPromise.call(this,
                        $value,
                        currFieldSchema,
                        this._conditions._id,
                        key
                    );

                    toUpdate && promises.push(toUpdate);
                });
            } else {
                const currFieldSchema = schemaObj[key] || {};
                const toUpdate = buildPromise.call(this,
                    value,
                    currFieldSchema,
                    this._conditions._id,
                    key
                );

                toUpdate && promises.push(toUpdate);
            }
        })
    
        const updated = await Promise.all(promises);
        return updated;
    } catch(err) {
        throw new Error.Log(err);
    }
}

async function onDelete() {
    try {
        const filter = this.getFilter();
        const currentDoc = await this.model.findOne(filter);
        const promises = [];
    
        if (!currentDoc) {
            return;
        }

        // Iterate each field of the current document being deleted
        Object.entries(this.schema.obj).map(([key, value]) => {
            if (!value.refConfig) return;

            const toUpdate = buildPromise.call(this,
                currentDoc[key],
                value,
                this._conditions._id,
                '$pull',
                'delete'
            );
            promises.push(toUpdate);
        });

        const updated = await Promise.all(promises);
        return updated;
    } catch(err) {
        throw new Error.Log(err);
    }
}

function isObjectID(value) {
    if (Array.isArray(value)) {
        return Boolean(value[0]._bsontype === 'ObjectId');
    } else {
        return Boolean(value._bsontype === 'ObjectId');
    }
}

module.exports = {
    onCreate,
    onUpdate,
    onDelete,
    isObjectID
}
