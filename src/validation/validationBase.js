/**
 * Utility class for validating and manipulating data types and structures.
 */
class ValidationBase {
    /**
     * Constructs a ValidationBase instance with the provided value for validation.
     * @param {*} value - The value to be validated.
     */
    constructor(value) {
        this._value = value;
        this.success = true;
    }

    /**
     * Gets the current value being validated.
     * @returns {*} - The value being validated.
     */
    get value() {
        return this._value;
    }

    /**
     * Sets a new value for validation.
     * @param {*} newValue - The new value to be set for validation.
     * @returns {*} - The new value after setting.
     */
    setValue(newValue) {
        this._value = newValue;
        return this._value;
    }

    /**
     * Validates if the value is a string.
     * @returns {ValidationBase} - Returns the current instance if the value is a string; otherwise, rejects the validation.
     */
    string() {
        const typeOf = typeof this.value;
        return typeOf === 'string' ? this : this.reject();
    }

    /**
     * Validates if the value is a number and not NaN.
     * @returns {ValidationBase} - Returns the current instance if the value is a valid number; otherwise, rejects the validation.
     */
    number() {
        return typeof this.value === 'number' && !isNaN(this.value) ? this : this.reject();
    }

    /**
     * Validates if the value is an array.
     * @returns {ValidationBase} - Returns the current instance if the value is an array; otherwise, rejects the validation.
     */
    array() {
        return Array.isArray(this.value) ? this : this.reject();
    }

    /**
     * Validates if the value is an object (excluding arrays).
     * @returns {ValidationBase} - Returns the current instance if the value is a non-array object; otherwise, rejects the validation.
     */
    object() {
        return (typeof this.value === 'object' && !Array.isArray(this.value)) ? this : this.reject();
    }

    /**
     * Validates if the value is a function.
     * @returns {ValidationBase} - Returns the current instance if the value is a function; otherwise, rejects the validation.
     */
    function() {
        return typeof this.value === 'function' ? this : this.reject();
    }

    /**
     * Validates if the value exists and is not null, undefined, empty string, empty object, empty array, or zero (if zeroIsFalse is true for numbers).
     * @param {boolean} [zeroIsFalse=false] - A flag indicating whether zero should be considered a false value for numbers.
     * @returns {ValidationBase} - Returns the current instance if the value is non-empty; otherwise, rejects the validation.
     */
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

    /**
     * Determines if the current value is considered filled based on its type and optional condition.
     * @param {boolean} zeroIsFalse - A flag indicating whether the value 0 should be treated as false (optional).
     * @returns {Object} - Returns the current object instance if the value is considered filled, otherwise rejects the object.
     */
    filled(zeroIsFalse) {
        switch (typeof this.value) {
            case 'number': {
                /**
                 * If the value is a number, checks if it is zero and zeroIsFalse is true,
                 * then rejects the object; otherwise, considers the object as filled.
                 */
                if (zeroIsFalse && this.value === 0) return this.reject();
                return this;
            }
            case 'object': {
                /**
                 * If the value is an object, checks if it is falsy or an empty array or an empty object,
                 * then rejects the object; otherwise, considers the object as filled.
                 */
                if (!this.value) return this.reject();
                if (Array.isArray(this.value)) return this.value.length ? this : this.reject();
                return Object.keys(this.value).length ? this : this.reject();
            }
            case 'string':
            default: 
                /**
                 * For strings and other data types, checks if the value is truthy,
                 * then considers the object as filled; otherwise, rejects the object.
                 */
                return this.value ? this : this.reject();
        }
    }

    /**
     * Validates if the number is non-zero and not NaN.
     * @returns {boolean} - Returns `true` if the number is non-zero and not NaN; otherwise, `false`.
     */
    numberFilled() {
        return this.number().filled().eval();
    }

    /**
     * Validates if the string is non-empty.
     * @returns {boolean} - Returns `true` if the string is non-empty; otherwise, `false`.
     */
    stringFilled() {
        return this.string().filled().eval();
    }

    /**
     * Validates if the object is non-empty (not null, undefined, or empty object).
     * @returns {boolean} - Returns `true` if the object is non-empty; otherwise, `false`.
     */
    objectFilled() {
        return this.object().filled().eval();
    }

    /**
     * Validates if the array is non-empty.
     * @returns {boolean} - Returns `true` if the array is non-empty; otherwise, `false`.
     */
    arrayFilled() {
        return this.array().filled().eval();
    }

    /**
     * Marks the validation as unsuccessful and sets the success flag to false.
     * @returns {ValidationBase} - Returns the current instance after marking it as unsuccessful.
     */
    reject() {
        this.success = false;
        return this;
    }

    /**
     * Checks if the validation was successful and evaluates the result.
     * @param {boolean} [dontReturnValue=false] - A flag indicating whether to return the value on success.
     * @returns {boolean|*} - Returns `true` if successful, the validated value if `dontReturnValue` is false, 
     * or `false` on failure.
     */
    eval(dontReturnValue) {
        if (!this.success) return false;
        return dontReturnValue ? true : this.value; 
    }

    /**
     * Static method to determine if the provided object is a MongoDB ObjectID.
     * @param {*} obj - The object to be checked.
     * @returns {boolean} - `true` if the object is a MongoDB ObjectID, `false` otherwise.
     */
    static isObjectID(obj) {
        if (typeof obj === 'object') {
            if (Array.isArray(obj) && obj.length) {
                return isObjectID(obj[0]);
            }

            return Boolean(obj?._bsontype === 'ObjectId');
        }
    
        return false
    }

    /**
     * Static method to determine if the provided object IS A COMPLETE DOC
     * @param {*} obj - The object to be checked.
     * @returns {boolean} - `true` if the object is a MongoDB ObjectID, `false` otherwise.
     */
    static isCompleteDoc(doc) {
        return [
            (!ValidationBase.isObjectID(doc)),
            (typeof doc === 'object')
        ].every(item => item);
    }
}

/**
 * Factory function to create a ValidationBase instance for a specific value.
 * @param {*} value - The value to be validated.
 * @returns {ValidationBase} - A ValidationBase instance for the provided value.
 */
function build(value) {
    const isValid = new ValidationBase(value);
    return isValid;
}

module.exports = {
    build,
    ValidationBase
};
