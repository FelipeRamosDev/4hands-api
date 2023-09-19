const views = require('./views');
const ToolsCLI = require('./ToolsCLI');

class CLI extends ToolsCLI {
    constructor(setup = {
        startView,
        startViewParams
    }) {
        super();
        const { startView, startViewParams } = setup || {};

        this.startView = startView;
        this.startViewParams = startViewParams;
        this._currView;

        this.getCurrentView = () => {
            return this._currView;
        }
    }

    async init() {
        await this.loadView(this.startView, this.startViewParams);
        return this;
    }

    setCurrentView(viewName) {
        this._currView = viewName;
        return this._currView;
    }

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
            const loadedView = await View.call(this, {viewParams});
            
            this.setCurrentView(loadedView);
            await loadedView.render();

            return loadedView;
        } else {
            this.printError(new Error.Log({
                name: 'LoadingView',
                message: `View path not found! ${viewPath}`
            }));
        }
    }

    async goToStart() {
        return await this.loadView(this.startView);
    }
}

module.exports = CLI;
