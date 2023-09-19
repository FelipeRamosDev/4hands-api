class StringTemplateBuilder {
    constructor(setup = {
        indentation: 4
    }) {
        const { indentation } = setup || {};

        this.result = '';
        this.indentation = indentation;
        this.textColumnLength = 40;
    }

    text(value) {
        this.result += String(value);
        return this;
    }

    separator() {
        return this
            .newLine()
            .text('------------------------------------------------------------------------------------------------------------------------')
            .newLine();
    }

    textColumn(text, length) {
        if (!length) length = this.textColumnLength;
        let parsed = String(text).substring(0, length);

        if (text && text.length > length) {
            parsed += '...';
        } else if (text) {
            for (let i = text.length; i <= length; i++) {
                parsed += ' ';
            }
        }

        this.result += parsed;
        return this;
    }

    newLine(char) {
        this.result += char || '\n';
        return this;
    }

    var(name, type) {
        if (!name || !type) {
            throw new Error.Log('common.missing_params', ['name', 'type']);
        }

        this.result += `%{{${name}:${type}}}%`;
        return this;
    }

    tab() {
        return this.indent(this.indentation);
    }

    indent(indentation) {
        if (!indentation) {
            indentation = this.indentation;
        }

        for (let i = 0; i < indentation; i++) {
            this.result += ' ';
        }

        return this;
    }

    end() {
        return this.result;
    }
}

module.exports = StringTemplateBuilder;
