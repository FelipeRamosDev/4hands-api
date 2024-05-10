/**
 * Class representing a MemoryData.
 */
class MemoryData {
    /**
     * Create a MemoryData.
     * @param {number} value - The value of the memory data.
     * @param {string} sizeUnit - The unit of the memory data size.
     */
    constructor (value, sizeUnit) {
        if (isNaN(value)) {
            throw 'Param "value" should be a valid number!';
        }

        this.value = Number(value);
        this.originalValue = Number(value);
        this.sizeUnit = sizeUnit;
        this.originalSizeUnit = sizeUnit;
    }

    /**
     * Set the size unit of the memory data.
     * @param {string} unit - The unit to set.
     * @return {number} The converted value.
     */
    setSizeUnit(unit) {
        if (typeof unit !== 'string') {
            return;
        }

        switch (unit.toLowerCase()) {
            case 'kb':
            case 'mb':
            case 'gb': {
                this.sizeUnit = unit;
                this.value = this.convert(unit);

                return this.value;
            }
        }
    }

    /**
     * Convert the memory data to a specific unit.
     * @param {string} convertTo - The unit to convert to.
     * @return {number} The converted value.
     */
    convert(convertTo) {
        if (convertTo === 'gb') {
            return this.toGB();
        }

        if (convertTo === 'mb') {
            return this.toMB();
        }

        if (convertTo === 'kb') {
            return this.toKB();
        }

        return this.value;
    }
    
    /**
     * Convert the memory data to GB.
     * @return {number} The converted value.
     */
    toGB() {
        return this.originalValue / 1024 / 1024 / 1024;
    }
    
    /**
     * Convert the memory data to MB.
     * @return {number} The converted value.
     */
    toMB() {
        return this.originalValue / 1024 / 1024;
    }
    
    /**
     * Convert the memory data to KB.
     * @return {number} The converted value.
     */
    toKB() {
        return this.originalValue / 1024;
    }

    /**
     * Display the memory data value in a specific unit.
     * @param {string} convertTo - The unit to display in.
     * @return {string} The displayed value.
     */
    displayValue(convertTo) {
        let converted = this.convert(convertTo);

        if (!convertTo) {
            convertTo = ' B';
            return converted + convertTo;
        }

        const fixed = converted.toFixed(3);
        return fixed + ' ' + convertTo.toUpperCase();
    }

    /**
     * Reset the memory data to its original value and size unit.
     */
    reset() {
        this.value = this.originalValue;
        this.sizeUnit = this.originalSizeUnit;
    }
}

module.exports = MemoryData;
