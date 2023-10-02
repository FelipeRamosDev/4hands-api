const ToolsCLI = require('./ToolsCLI');

/**
 * Model representing an option for the ViewNavigator class, extended by the ToolsCLI class.
 * @class
 */
class NavigatorOption extends ToolsCLI {
    /**
     * Creates an instance of NavigatorOption.
     * @constructor
     * @param {Object} setup - The configuration object for the NavigatorOption.
     * @param {number|string} setup.index - The index that triggers the navigation option on user input.
     * @param {string} setup.type - The type of the option: 'nav' for navigation or 'doc-list' for document listing.
     * @param {string} setup.title - The title displayed as the label of the navigation option.
     * @param {string} setup.description - The description displayed as the label of the navigation option.
     * @param {string} setup.targetView - The path of the view to be opened, e.g., "crud/create".
     * @param {Object} setup.viewParams - Parameters to be passed when the selected view is loaded.
     * @param {Object} setup.defaultData - Data loaded as a parameter when the selected view is loaded.
     * @param {Function} setup.trigger - A function triggered when the option is selected.
     * @param {Object} setup.doc - The document to be loaded when type is 'doc-list'.
     * @param {Function} viewNavigator - A function returning the ViewNavigator instance.
     */
    constructor(setup, viewNavigator) {
        super();
        const { index, type, title, description, targetView, doc, viewParams, defaultData, trigger } = setup || {};

        /**
         * The index that triggers the navigation option on user input.
         * @type {string}
         */
        this.index = String(index);

        /**
         * The type of the option: 'nav' for navigation or 'doc-list' for document listing.
         * @type {string}
         * @default 'nav'
         */
        this.type = type || 'nav';

        /**
         * The title displayed as the label of the navigation option.
         * @type {string}
         */
        this.title = title;

        /**
         * The description displayed as the label of the navigation option.
         * @type {string}
         */
        this.description = description;

        /**
         * The path of the view to be opened, e.g., "crud/create".
         * @type {string}
         */
        this.targetView = targetView;

        /**
         * Parameters to be passed when the selected view is loaded.
         * @type {Object}
         */
        this.viewParams = viewParams;

        /**
         * A function triggered when the option is selected.
         * @type {Function}
         */
        this.trigger = trigger;

        /**
         * Data loaded as a parameter when the selected view is loaded.
         * @type {Object}
         */
        this.defaultData = defaultData;

        /**
         * A function returning the ViewNavigator instance.
         * @type {Function}
         * @private
         */
        this._viewNavigator = () => viewNavigator;

        /**
         * The document to be loaded when type is 'doc-list'.
         * @type {Object}
         */
        this.doc = doc;
    }

    /**
     * Gets the combined display name of the option, including title and description.
     * @type {string}
     * @readonly
     */
    get displayName() {
        let result = '';

        if (this.title) result += this.title;
        if (this.description) {
            result += ' - ';
            result += this.description;
        }

        return result;
    }

    /**
     * Gets the unique identifier of the associated document when the option type is 'doc-list'.
     * @type {string}
     * @readonly
     */
    get docUID() {
        return this.doc && this.doc._id;
    }

    /**
     * Gets the ViewNavigator instance associated with this option.
     * @type {ViewNavigator}
     * @readonly
     */
    get viewNavigator() {
        return this._viewNavigator();
    }
}

/**
 * Model of option for the ViewNavigator class.
 * @module NavigatorOption
 */
module.exports = NavigatorOption;
