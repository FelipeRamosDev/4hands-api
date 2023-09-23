/**
 * A class representing a command-line interface for form control.
 * @class
 */
class FormCtrlCLI {
    /**
     * Creates an instance of FormCtrlCLI.
     * @param {Object} [setup] - The setup options for the form control CLI.
     * @param {string} [setup.mode='create'] - The mode of the form control CLI ('edit' or 'create').
     * @param {Object} [setup.schema={}] - The schema for the form control CLI.
     * @param {Object} [setup.defaultData={}] - The default data for the form control CLI.
     * @param {string[]} [setup.exclude=[]] - The list of fields to exclude from the form control CLI.
     * @param {Object} parent - The parent object of the form control CLI.
     */
    constructor(setup, parent) {
        const { mode, schema, exclude, defaultData } = Object(setup || {});

        this.mode = mode || 'create'; // 'edit' | 'create'
        this.schema = schema;
        this.exclude = exclude || ['_id', 'createdAt', 'modifiedAt', 'index', 'cod'];
        this.formFields = [];
        this.formData = {};
        this.defaultData = defaultData;

        if (schema) {
            this.setForm(schema);
        }

        this._parent = () => parent;
    }

    /**
     * Sets a field in the form data.
     * @param {string} key - The key of the field to set.
     * @param {any} value - The value to set for the field.
     */
    setField(key, value) {
        if (value) {
            this.formData[key] = value;
        }
    }

    /**
     * Builds the form data for the form control CLI.
     * @returns {Object} The form data for the form control CLI.
     */
    buildFormData() {
        const result = {};

        if (this.schema) {
            Object.entries(this.schema).map(([key, value]) => {
                if (!this.exclude.find(item => item === key)){
                    if (this.mode === 'create') {
                        result[key] = value.default;
                    }
                    this.formFields.push(key);
                }
            });
        } else {
            throw new Error.Log('common.missing_param', 'this.schema', 'FormCtrl.buildFormData');
        }

        this.formData = result;
        return result;
    }

    /**
     * Sets the schema for the form control CLI.
     * @param {Object} schema - The schema to set.
     */
    setSchema(schema) {
        if (schema) {
            this.schema = schema;
        } else {
            throw new Error.Log('common.missing_param', 'schama', 'FormCtrlCLI.setSchema');
        }
    }

    /**
     * Get the field schema.
     * @param {string} path - The path of the field schema.
     * @returns {*} - The field schema.
     */
    getFieldSchema(path) {
        const parsedPath = path.split('.');
        let result = this.schema;

        parsedPath.map(item => {
            if (result) result = result[item];
        });

        if (result) return result;
    }

    /**
     * Set a new form on the the PoolForm
     * @param {Object} schema - The schema object to set
     * @returns {void}
     */
    setForm(schema) {
        if (!this.schema) this.setSchema(schema);
        this.buildFormData();

        return this;
    }
}

/**
 * Represents a handler for events related to a form.
 * @module FormCtrlCLI
 */
module.exports = FormCtrlCLI;
