const ToolsCLI = require('./ToolsCLI');
const NavigatorOption = require('./NavigatorOption');
const ListTiles = require('4hands-api/src/interface/CLI/templates/ListTiles');
const Prompt = require('4hands-api/src/services/Prompt');
const { QuestionModel } = require('./PoolForm');

/**
 * Default navigation questions for the ViewNavigator class.
 * @type {Object}
 */
const navDefaultQuestions = {
    startQuestion: 'navigation',
    questions: [
        {
            id: 'navigation',
            text: 'Choose an option above to navigate, type the index of the choosed option: ',
            required: true
        }
    ]
};

/**
 * Class representing a view navigator with navigation options.
 * @extends ToolsCLI
 */
class ViewNavigator extends ToolsCLI {
    static navDefaultQuestions = navDefaultQuestions;

    /**
     * Creates an instance of ViewNavigator.
     * @constructor
     * @param {Object} [setup] - The configuration for the view navigator instance.
     * @param {string} [setup.type='nav'] - The type of navigation ('nav' or 'doc-list').
     * @param {Array} [setup.options=[]] - Array of navigation options.
     * @param {Function} [setup.navSuccessCallback] - Callback function on successful navigation.
     * @param {Function} [setup.navErrorCallback] - Callback function on navigation error.
     * @param {Object} [setup.question] - Question configuration for prompting user input.
     * @param {ViewCLI} parentView - The parent view associated with this navigator.
     */
    constructor(setup = {
        type: 'nav',
        options: [],
        navSuccessCallback,
        navErrorCallback,
        question
    }, parentView) {
        super();
        const { type, options, question, navSuccessCallback, navErrorCallback } = setup || {};
        const self = this;

        /**
         * The type of navigation ('nav' or 'doc-list').
         * @type {string}
         */
        this.type = type || 'nav';

        /**
         * Array of navigation options.
         * @type {Array}
         */
        this.options = [];

        /**
         * Question configuration for prompting user input.
         * @type {Object}
         */
        this.question = question ? new QuestionModel(question) : {};

        /**
         * Callback function on successful navigation.
         * @type {Function}
         */
        this.navSuccessCallback = navSuccessCallback && navSuccessCallback.bind(this);

        /**
         * Callback function on navigation error.
         * @type {Function}
         */
        this.navErrorCallback = navErrorCallback && navErrorCallback.bind(this);

        /**
         * The parent view associated with this navigator.
         * @type {ViewCLI}
         */
        this._parentView = () => parentView;

        if (Array.isArray(options)) {
            this.options = options.map((opt, index) => new NavigatorOption({ ...opt, index }, self));
        }
    }

    /**
     * Retrieves the parent view associated with this navigator.
     * @returns {ViewCLI} The parent view instance.
     */
    get parentView() {
        return this._parentView();
    }

    /**
     * Navigates to a specific navigation option by its index.
     * @param {string} index - The index of the navigation option to navigate to.
     * @param {Object} [params] - Additional parameters to be passed to the view.
     * @throws {Error.Log} When an error occurs during navigation.
     */
    async navTo(index, params) {
        const opt = this.getOption(index);

        if (!opt) {
            this.print(`Navigation option for index "${index}" wasn't found!`, '[ERROR]');
        }

        if (typeof opt.trigger === 'function') {
            return opt.trigger.call(opt, this);
        }

        if (this.parentView && opt && opt.targetView){
            return await this.parentView.goToView(opt.targetView, {
                ...opt.viewParams,
                ...params,
                defaultData: opt.defaultData,
                docData: opt.doc
            });
        }
    }

    /**
     * Retrieves a navigation option by its index.
     * @param {string} index - The index of the navigation option to retrieve.
     * @returns {NavigatorOption} The navigation option instance.
     */
    getOption(index) {
        return this.options.find(opt => opt.index === index);
    }

    /**
     * Adds a new navigation option to the navigator.
     * @param {Object} data - Data for the new navigation option.
     * @returns {ViewNavigator} The current ViewNavigator instance.
     */
    addOption(data) {
        const newOption = new NavigatorOption(data, this);

        newOption.type = this.type;
        this.options.push(newOption);
        return this;
    }

    /**
     * Sets or updates an existing navigation option by its index.
     * @param {string} index - The index of the navigation option to set or update.
     * @param {Object} data - Data for the navigation option.
     * @param {boolean} [override=false] - Indicates whether to override the existing option or merge the data.
     */
    setOption(index, data, override = false) {
        const i = String(index);

        if (override) {
            this.options[i] = new NavigatorOption(data, this);
        } else {
            this.options[i] = { ...this.options[i], ...data };
        }
    }

    /**
     * Renders the navigation options and displays them to the user.
     * @param {Object} [params] - Additional parameters for rendering.
     * @returns {string} The rendered string output of the navigation options.
     * @throws {Error.Log} When an error occurs during rendering.
     */
    render(params) {
        let { exclude } = params || {};
        let options = [];

        if (this.type === 'doc-list') {
            this.options.map((opt) => options.push(opt.doc));
        } else {
            options = this.options;
            exclude = ['type', 'targetView', ...(exclude || [])];
        }

        try {
            if (Array.isArray(options) && options.length) {
                const template = new ListTiles({ items: options });
                const stringOutput = template.renderToString();
                
                this.printTemplate(stringOutput);
                return stringOutput;
            } else {
                return '';
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Prompts user input based on the provided question text and navigates to the chosen option.
     * @param {Object} [params] - Additional parameters for rendering and navigation.
     * @returns {Promise} A promise resolving to the result of navigation.
     * @throws {Error.Log} When an error occurs during navigation.
     */
    async fire(params) {
        try {
            this.render(params);
            const questionText = this.question && this.question.text || '';

            const fired = await this.prompt.question(questionText);
            if (fired instanceof Error.Log) {
                throw fired;
            }

            return await this.navTo(fired);
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = ViewNavigator;
