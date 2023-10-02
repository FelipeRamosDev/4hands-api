const ToolsCLI = require('./ToolsCLI');
const ViewNavigator = require('./ViewNavigator');
const PoolForm = require('./PoolForm');

/**
 * Class representing a command-line interface view with navigation capabilities.
 * @extends ToolsCLI
 */
class ViewCLI extends ToolsCLI {
    /**
     * Creates an instance of ViewCLI.
     * @constructor
     * @param {Object} [setup] - The configuration for the view instance.
     * @param {string} [setup.name] - The name of the view.
     * @param {PoolForm} [setup.poolForm] - The pool form associated with the view.
     * @param {ViewNavigator} [setup.navigator] - The view navigator for navigating between views.
     * @param {Component} [setup.Template] - The template component for rendering the view content.
     * @param {CLI} [cli] - The command-line interface instance.
     * @throws {Error.Log} When essential parameters are missing.
     */
    constructor(setup = {
        name: '',
        poolForm: PoolForm.prototype,
        navigator: ViewNavigator.prototype,
        Template
    }, cli) {
        super(setup);
        const { name, poolForm, navigator, Template } = setup || {};

        if (!cli) {
            throw new Error.Log('common.missing_params', 'cli', 'ViewCLI', 'ViewCLI.js');
        }

        /**
         * The name of the view.
         * @type {string}
         */
        this.name = name;

        /**
         * The template component for rendering the view content.
         * @type {Component}
         */
        this.Template = Template;

        /**
         * The pool form associated with the view.
         * @type {PoolForm}
         */
        this.poolForm = poolForm && new PoolForm(poolForm, this);

        /**
         * The view navigator for navigating between views.
         * @type {ViewNavigator}
         */
        this.navigator = navigator && new ViewNavigator(navigator, this);

        if (!this.poolForm) {
            this.poolForm = new PoolForm(ViewNavigator.navDefaultQuestions, this);
            this.poolForm.setListener('onAnswer', (ev) => {
                this.navigator.navTo(ev.answer);
            });
        }

        /**
         * The command-line interface instance.
         * @type {CLI}
         */
        this.cli = () => cli;
    }

    /**
     * Navigates to a specific view path with optional parameters.
     * @param {string} viewPath - The path of the view to navigate to.
     * @param {Object} [params] - Additional parameters to be passed to the view.
     * @throws {Error.Log} When an error occurs during view navigation.
     */
    goToView(viewPath, params) {
        try {
            this.cli().loadView(viewPath, params);
        } catch(err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Gets the rendered string content of the view.
     * @returns {string} The rendered string content of the view.
     */
    getString() {
        if (this.Template) {
            return this.Template.renderToString();
        } else {
            return '';
        }
    }

    /**
     * Renders the view, including its content, pool form, and navigator.
     * @param {Object} [tableHeaders] - Additional headers for rendering tabular data.
     * @throws {Error.Log} When an error occurs during view rendering.
     */
    render(tableHeaders) {
        try {
            this.cli().printTemplate(this.getString());

            if (this.poolForm) {
                this.poolForm.start();
            }
            
            if (this.navigator) {
                this.navigator.render(tableHeaders);
            }
        } catch(err) {
            throw new Error.Log(err);
        }
    }
}

/**
 * A command-line interface view with navigation capabilities.
 * @module ViewCLI
 */
module.exports = ViewCLI;
