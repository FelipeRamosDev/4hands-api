const ToolsCLI = require('./ToolsCLI');
const NavigatorOption = require('./NavigatorOption');
const ListTiles = require('@CLI/templates/ListTiles');
const Prompt = require('@services/Prompt');
const { QuestionModel } = require('./PoolForm');

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

class ViewNavigator extends ToolsCLI {
    static navDefaultQuestions = navDefaultQuestions;

    constructor(setup = {
        ...this,
        type: '', // nav or doc-list
        options: [NavigatorOption.prototype],
        navSuccessCallback,
        navErrorCallback,
        question
    }, parentView) {
        super();
        const {type, options, question, navSuccessCallback, navErrorCallback} = new Object(setup || {});
        const self = this;

        this.type = type || 'nav';
        this.options = [];
        this.question = question ? new QuestionModel(question) : {};
        this.navSuccessCallback = navSuccessCallback && navSuccessCallback.bind(this);
        this.navErrorCallback = navErrorCallback && navErrorCallback.bind(this);

        this.prompt = new Prompt();
        this._parentView = () => parentView;

        if (Array.isArray(options)) {
            this.options = options.map((opt, index) => new NavigatorOption({...opt, index}, self));
        }
    }

    get parentView() {
        return this._parentView();
    }

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

    getOption(index) {
        return this.options.find(opt => opt.index === index);
    }

    addOption(data) {
        const newOption = new NavigatorOption(data, this);

        newOption.type = this.type;
        this.options.push(newOption);
        return this;
    }

    setOption(index, data, override) {
        const i = String(index);

        if (override) {
            this.options[i] = new NavigatorOption(data, this);
        } else {
            this.options[i] = {...this.options[i], ...data};
        }
    }

    render(params) {
        let { exclude } = params || {};
        let options = [];

        if (this.type === 'doc-list') {
            this.options.map((opt) => options.push( opt.doc ));
        } else {
            options = this.options;
            exclude = ['type', 'targetView', ...(exclude || [])];
        }

        try {
            if (Array.isArray(options) && options.length) {
                const template = new ListTiles({items: options});
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
