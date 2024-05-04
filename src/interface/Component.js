const ValidateSchema = require('../validation/validateSchema');
const FS = require('../services/FS');
const ToolsCLI = require('./CLI/ToolsCLI');
const DataDependency = require('4hands-api/src/models/DataDependency');

/**
 * Default validation rules for the Component class.
 * @type {Object}
 */
const defaultRules = {
    componentName: { type: String, default: () => 'comp-' + Date.now()},
    description: { type: String },
    outputModel: { type: String, default: ''},
    types: { type: Object, default: {} }
}

/**
 * Class representing a component with validation and rendering capabilities.
 * @extends ValidateSchema
 */
class Component extends ValidateSchema {
    /**
     * Creates an instance of Component.
     * @constructor
     * @param {Object} setup - The configuration for the component instance.
     * @param {Object} validationRules - Validation rules for the component.
     */
    constructor(setup, validationRules){
        super(typeof validationRules === 'string' ? validationRules : {...defaultRules, ...validationRules});
        const self = this;
        this.tools = new ToolsCLI();

        try {
            const { componentName, description, outputModel, types, dataDependencies, subscriptionUID, hide, attr, css } = setup || {};

            this.componentName = componentName;
            this.subscriptionUID = subscriptionUID;
            this.description = description;
            this.outputModel = outputModel;
            this.types = types;
            this.dataDependencies = Array.isArray(dataDependencies) ? dataDependencies.map(item => new DataDependency(item, this)) : [];
            this.css = '';
            this.attr = Object(attr);
            this.attributesHTML = '';

            if (Array.isArray(css)) {
                this.css = css.join(' ');
            }

            Object.keys(this.attr).map(key => (this.attributesHTML += ` ${key}="${this.attr[key]}"`));

            if (hide) {
                this.hide = 'hide';
            }

            this.placeDefault();

            try {
                this.loadSourceFile();
                const keys = Object.keys(this.types || {});
    
                for (let key of keys) {
                    const Type = this.types[key];
                    this.types[key] = Type;
                }
    
                return this;
            } catch(err) {
                throw logError(err);
            }
        } catch(err) {
            const error = logError(err);

            Object.keys(self).map(key => delete self[key]);
            Object.keys(error).map(key => self[key] = error[key]);
            throw error.stack;
        }
    }

    /**
     * Gets the template string content from the source file.
     * @type {string}
     */
    get TEMPLATE_STRING() {
        return FS.readFileSync(this.SOURCE_PATH);
    }

    /**
     * Retrieves setters for component properties.
     * @type {Object}
     */
    get setters() {
        return {}
    }

    /**
     * Adds a subscription to the component.
     * @param {any} subscription - The subscription to be added.
     * @throws {Error.Log} When an error occurs while adding the subscription.
     */
    addSubscription(subscription) {
        try {
            this.subscriptions.push(subscription);
        } catch(err) {
            throw logError(err);
        }
    }

    /**
     * Loads dependencies of the component.
     * @returns {Promise} A promise resolving to the loaded component with dependencies.
     * @throws {Error.Log} When an error occurs while loading dependencies.
     */
    async loadDependencies() {
        try {
            await Promise.all(this.dataDependencies.map(dep => dep.load()));

            this.dataDependencies.map(item => {
                this[item.name] = item.value;
            });

            return this;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Merges and updates component properties with provided data.
     * @param {Object} data - Data to update the component with.
     * @throws {Error.Log} When an error occurs during data update.
     */
    updateMerge(data) {
        try {
            Object.keys(data).map(key => {
                const value = data[key];
                const setter = this.setters[key];

                if (setter) {
                    setter(value);
                } else {
                    this[key] = value;
                }
            });
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Loads the source file content and updates the output model of the component.
     * @param {string} [path] - The path to the source file.
     * @returns {string} The loaded output model.
     * @throws {Error.Log} When an error occurs while loading the source file.
     */
    loadSourceFile(path) {
        try {
            if (!path && !this.SOURCE_PATH) {
                return this.outputModel;
            }

            const loaded = this.TEMPLATE_STRING;
            if (loaded instanceof Error.Log) {
                throw loaded;
            }

            this.outputModel = loaded;
            return loaded;
        } catch(err) {
            throw logError(err);
        }
    }

    /**
     * Converts the given value to a string.
     * @param {any} [value=''] - The value to convert to a string.
     * @returns {string} The converted string value.
     * @throws {Error.Log} When an invalid value format is provided.
     */
    string(value = '') {
        if (typeof value === 'string' || typeof value === 'number') {
            return String(value || '');
        } else {
            throw logError('common.bad_format_param', 'value', 'StringComponent', 'string', value, 'StringComponent.js');
        }
    }

    /**
     * Converts an array of items to a string based on the child type name.
     * @param {Array} [itemValue=[]] - Array of items to convert to a string.
     * @param {string} childTypeName - The child type name for rendering items.
     * @returns {string} The rendered string representation of the array.
     */
    array(itemValue = [], childTypeName) {
        const Child = this.types[childTypeName];
        let result = '';

        if (Array.isArray(itemValue) && (Child || childTypeName === 'component')) {
            for (let i = 0; i < itemValue.length; i++) {
                const item = itemValue[i];

                item.selfIndex = String(i);

                if (childTypeName === 'component') {
                    result += item.renderToString();
                } else {
                    if (Child instanceof Component) {
                        result += Child.renderToString(item);
                    } else {
                        result += new Child(item).renderToString();
                    }
                }
            }
        } else {
            result += '';
        }

        return result;
    }

    /**
     * Converts the given value to a JSON string.
     * @param {any} value - The value to convert to a JSON string.
     * @returns {string} The JSON string representation of the value.
     * @throws {Error.Log} When an error occurs during JSON conversion.
     */
    json(value) {
        try {
            return JSON.stringify(Object(value));
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Converts the given date value to a formatted string.
     * @param {any} value - The date value to format.
     * @returns {string} The formatted date string.
     */
    date(value) {
        try {
            const localString = new Date(value).toLocaleString();
            return localString;
        } catch(err) {
            return '--invalid-date-format--';
        }
    }

    /**
     * Converts an array of children components to a concatenated string representation.
     * @param {Array} children - Array of child components to convert.
     * @returns {string} The concatenated string representation of children components.
     */
    children(children) {
        let stringResult = '';

        if (Array.isArray(children)) {
            children.map(child => stringResult += child.getString());
        } else if (children) {
            stringResult += children.getString();
        }

        return stringResult;
    }

    /**
     * Converts the component's output model to a markdown string based on provided parameters.
     * @param {Object} [params] - Parameters for converting the output model to markdown.
     * @returns {string} The converted markdown string.
     * @throws {Error.Log} When an error occurs during markdown conversion.
     */
    toMarkdown(params) {
        // Find substrings between %{{ and }}% and replace by the param value
        const regex = /%{{(.*?)}}%/g;
        const substrings = [];
        let result = this.outputModel;
        let match;

        while (match = regex.exec(this.outputModel)) {
            substrings.push(match[1]);
        }

        for (let sub of substrings) {
            const [key, type, child] = sub.split(':');
            const paramValue = params && params[key] || this[key];
            let value;
            let toReplaceString;

            if (type === 'string') {
                value = this.string(paramValue);
                toReplaceString = `%{{${sub}}}%`;
            }

            if (type === 'array') {
                value = this.array(paramValue, child);
                toReplaceString = `%{{${sub}}}%`;
            }

            if (type === 'json') {
                value = this.json(paramValue);
                toReplaceString = `%{{${sub}}}%`;
            }

            if (type === 'date') {
                value = this.date(paramValue);
                toReplaceString = `%{{${sub}}}%`;
            }

            if (type === 'component') {
                value = paramValue && paramValue.renderToString ? paramValue.renderToString() : ' ';
                toReplaceString = `%{{${sub}}}%`;
            }

            result = result.replace(new RegExp(toReplaceString, 'g'), value || '');
        }

        return result;
    }

    /**
     * Renders the component to a string based on provided parameters.
     * @param {Object} [params] - Parameters for rendering the component.
     * @returns {string} The rendered string output of the component.
     * @throws {Error.Log} When an error occurs during rendering.
     */
    renderToString(params) {
        try {
            const stringResult = this.toMarkdown(params);
            if (stringResult instanceof Error.Log) {
                throw stringResult;
            }

            return stringResult;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Prints the rendered component output on the screen based on provided parameters.
     * @param {Object} [params] - Parameters for printing the component output.
     * @throws {Error.Log} When an error occurs during printing.
     */
    printOnScreen(params) {
        try {
            const stringResult = this.renderToString(params);
            this.tools.printTemplate(stringResult);
        } catch (err) {
            throw logError(err);
        }
    }
}

module.exports = Component;
