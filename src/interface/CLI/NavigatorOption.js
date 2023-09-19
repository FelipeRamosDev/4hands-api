const ToolsCLI = require('./ToolsCLI');

/**
 * Model of option for the ViewNavigator class which is extended by ToolsCLI class
 * @class
 */
class NavigatorOption extends ToolsCLI {
    /**
     * @constructor
     * @param {NavigatorOption} setup - The object of params to set the NavigatorOption. It has the same props as the prototype
     * @param {string} setup.type - 'nav' or 'doc-list'
     * @param {string} setup.title - The title that should be displayed as label of the navigation option
     * @param {string} setup.description - The description that should be displayed as label of the navigation option
     * @param {string} setup.targetView - The path of the view to be opened. Eg: "crud/create"
     * @param {Object} setup.viewParams - Params to be passed when the view selected was loaded.
     * @param {Object} setup.defaultData - Data that you want to load as param when the view selected was loaded.
     * @param {Function} setup.trigger - 
     * @param {Object} setup.doc - The document to be loaded on with the type = 'doc-list' set.
     * @param {number|string} setup.index - The index that will fire the navigation option on user input.
     */
    constructor(setup, viewNavigator) {
        super();
        const { index, type, title, description, targetView, doc, viewParams, defaultData, trigger } = new Object(setup || {});

        this.index = String(index);
        this.type = type || 'nav';
        this.title = title;
        this.description = description;
        this.targetView = targetView;
        this.viewParams = viewParams;
        this.trigger = trigger;
        this.defaultData = defaultData;
        this._viewNavigator = () => viewNavigator;

        if (type === 'doc-list') {
            this.doc = doc;
        }
    }

    get displayName() {
        let result = '';

        if (this.title) result += this.title;
        if (this.description) {
            result += ' - ';
            result += this.description;
        }

        return result;
    }

    get docUID() {
        return this.doc && this.doc._id;
    }

    get viewNavigator() {
        return this._viewNavigator();
    }
}

/**
 * 
 * Model of option for the ViewNavigator class
 * @module NavigatorOption
 */
module.exports = NavigatorOption;
