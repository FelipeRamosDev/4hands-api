class ValidationBase {
    constructor(value) {
        this._value = value;
        this.success = true;
    }

    get value() {
        return this._value;
    }

    setValue(newValue) {
        this._value = newValue;
        return this._value;
    }

    string() {
        const typeOf = typeof this.value;
        return typeOf === 'string' ? this : this.reject();
    }

    number() {
        return typeof this.value === 'number' && !isNaN(this.value) ? this : this.reject();
    }

    array() {
        return Array.isArray(this.value) ? this : this.reject();
    }

    object() {
        return (typeof this.value === 'object' && !Array.isArray(this.value)) ? this : this.reject();
    }

    function() {
        return typeof this.value === 'function' ? this : this.reject();
    }

    path(keys) {
        let result = this.value;

        typeof keys === 'string' && keys.split('.').map(key => {
            if (result) result = result[key];
        });

        if (result) {
            this.setValue(result);
            return this;
        } else {
            return this.reject();
        }
    }

    filled(zeroIsFalse) {
        switch (typeof this.value) {
            case 'number': {
                if (zeroIsFalse && this.value === 0) return this.reject();
                return this;
            }
            case 'object': {
                if (!this.value) return this.reject();
                if (Array.isArray(this.value)) return this.value.length ? this : this.reject();
                return Object.keys(this.value).length ? this : this.reject();
            }
            case 'string':
            default: return this.value ? this : this.reject();
        }
    }

    numberFilled() {
        return this.number().filled().eval();
    }

    stringFilled() {
        return this.string().filled().eval();
    }

    objectFilled() {
        return this.object().filled().eval();
    }

    arrayFilled() {
        return this.array().filled().eval();
    }

    reject() {
        this.success = false;
        return this;
    }

    eval(dontReturnValue) {
        if (!this.success) return false;
        return dontReturnValue ? true : this.value; 
    }

    static isObjectID(obj) {
        if (typeof obj === 'object') {
            if (Array.isArray(obj) && obj.length) {
                return isObjectID(obj[0]);
            }

            return Boolean(Object(obj)._bsontype === 'ObjectID');
        }
    
        return false
    }

    static isCompleteDoc(doc) {
        return [
            (!ValidationBase.isObjectID(doc)),
            (typeof doc === 'object')
        ].every(item => item);
    }
}

function build(value) {
    const isValid = new ValidationBase(value);
    return isValid;
}

module.exports = {
    build,
    ValidationBase
};
