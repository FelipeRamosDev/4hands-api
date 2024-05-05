class MemoryData {
    constructor (value, sizeUnit) {
        if (isNaN(value)) {
            throw 'Param "value" should be a valid number!';
        }

        this.value = Number(value);
        this.originalValue = Number(value);
        this.sizeUnit = sizeUnit;
        this.originalSizeUnit = sizeUnit;
    }

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
    
    toGB() {
        return this.originalValue / 1024 / 1024 / 1024;
    }
    
    toMB() {
        return this.originalValue / 1024 / 1024;
    }
    
    toKB() {
        return this.originalValue / 1024;
    }

    displayValue(convertTo) {
        let converted = this.convert(convertTo);

        if (!convertTo) {
            convertTo = ' B';
            return converted + convertTo;
        }

        const fixed = converted.toFixed(3);
        return fixed + ' ' + convertTo.toUpperCase();
    }

    reset() {
        this.value = this.originalValue;
        this.sizeUnit = this.originalSizeUnit;
    }
}

module.exports = MemoryData;
