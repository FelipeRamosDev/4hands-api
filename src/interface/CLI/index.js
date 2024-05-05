const views = require('./views');
const ToolsCLI = require('./ToolsCLI');

/**
 * Class representing a Command Line Interface (CLI) application.
 * @extends ToolsCLI
 */
class CLI extends ToolsCLI {
    /**
     * Creates an instance of CLI.
     * @param {Object} setup - The setup configuration for the CLI.
     * @param {string} setup.startView - The initial view to be displayed upon CLI initialization.
     * @param {Object} setup.startViewParams - The parameters to be passed to the initial view.
     */
    constructor(setup = {
        startView,
        startViewParams
    }) {
        super();
        const { startView, startViewParams } = setup || {};

        /**
         * The name of the current view.
         * @type {string}
         * @private
         */
        this._currView;

        /**
         * The name of the initial view to be displayed upon CLI initialization.
         * @type {string}
         */
        this.startView = startView;

        /**
         * The parameters to be passed to the initial view.
         * @type {Object}
         */
        this.startViewParams = startViewParams;

        /**
         * Gets the name of the current view.
         * @returns {string} The name of the current view.
         */
        this.getCurrentView = () => {
            return this._currView;
        }
    }

    /**
     * Initializes the CLI application by loading the initial view.
     * @returns {CLI} The CLI instance.
     */
    async init() {
        await this.loadView(this.startView, this.startViewParams);
        return this;
    }

    /**
     * Sets the current view of the CLI application.
     * @param {string} viewName - The name of the view to set as the current view.
     * @returns {string} The name of the current view.
     */
    setCurrentView(viewName) {
        this._currView = viewName;
        return this._currView;
    }

    /**
     * Loads a specific view into the CLI application.
     * @param {string} viewPath - The path to the view module.
     * @param {Object} viewParams - The parameters to be passed to the view.
     * @returns {View} The loaded view instance.
     * @throws {Error.Log} If the specified view path is not found.
     */
    async loadView(viewPath, viewParams) {
        this.print('Loading view "' + viewPath + '"...', 'LOG');
        const parsedPath = viewPath.split('/');
        let View = views;

        parsedPath.map(path => {
            if (View) {
                View = View[path];
            }
        });

        if (typeof View === 'function') {
            const loadedView = await View.call(this, { viewParams });

            this.setCurrentView(loadedView);
            await loadedView.render();

            return loadedView;
        } else {
            this.printError(logError({
                name: 'LoadingView',
                message: `View path not found! ${viewPath}`
            }));
        }
    }

    /**
     * Navigates back to the initial view of the CLI application.
     * @returns {View} The loaded initial view instance.
     */
    async goToStart() {
        return await this.loadView(this.startView);
    }
}

module.exports = CLI;
