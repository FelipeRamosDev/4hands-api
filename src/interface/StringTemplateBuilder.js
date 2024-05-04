/**
 * Class representing a string template builder with various formatting capabilities.
 */
class StringTemplateBuilder {
    /**
     * Creates an instance of StringTemplateBuilder.
     * @constructor
     * @param {Object} setup - The configuration for the string template builder instance.
     * @param {number} [setup.indentation=4] - The number of spaces to use for each indentation level.
     */
    constructor(setup = {
        indentation: 4
    }) {
        const { indentation } = setup || {};

        this.result = '';
        this.indentation = indentation;
        this.textColumnLength = 40;
    }

    /**
     * Appends a string value to the template.
     * @param {string} value - The string value to append to the template.
     * @returns {StringTemplateBuilder} The current StringTemplateBuilder instance for method chaining.
     */
    text(value) {
        this.result += String(value);
        return this;
    }

    /**
     * Appends a separator line to the template.
     * @returns {StringTemplateBuilder} The current StringTemplateBuilder instance for method chaining.
     */
    separator() {
        return this
            .newLine()
            .text('------------------------------------------------------------------------------------------------------------------------')
            .newLine();
    }

    /**
     * Appends a text with a specific column length to the template.
     * @param {string} text - The text to append.
     * @param {number} [length=this.textColumnLength] - The column length.
     * @returns {StringTemplateBuilder} The current StringTemplateBuilder instance for method chaining.
     */
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

    /**
     * Appends a new line character to the template.
     * @param {string} [char='\n'] - The character to represent a new line.
     * @returns {StringTemplateBuilder} The current StringTemplateBuilder instance for method chaining.
     */
    newLine(char) {
        this.result += char || '\n';
        return this;
    }

    /**
     * Appends a variable placeholder to the template.
     * @param {string} name - The name of the variable.
     * @param {string} type - The type of the variable.
     * @returns {StringTemplateBuilder} The current StringTemplateBuilder instance for method chaining.
     * @throws {Error.Log} When either `name` or `type` is missing.
     */
    var(name, type) {
        if (!name || !type) {
            throw logError('common.missing_params', ['name', 'type']);
        }

        this.result += `%{{${name}:${type}}}%`;
        return this;
    }

    /**
     * Appends a tab indentation to the template.
     * @returns {StringTemplateBuilder} The current StringTemplateBuilder instance for method chaining.
     */
    tab() {
        return this.indent(this.indentation);
    }

    /**
     * Appends a specific number of spaces for indentation to the template.
     * @param {number} [indentation=this.indentation] - The number of spaces to use for indentation.
     * @returns {StringTemplateBuilder} The current StringTemplateBuilder instance for method chaining.
     */
    indent(indentation) {
        if (!indentation) {
            indentation = this.indentation;
        }

        for (let i = 0; i < indentation; i++) {
            this.result += ' ';
        }

        return this;
    }

    /**
     * Finalizes the template and returns the generated string.
     * @returns {string} The generated string template.
     */
    end() {
        return this.result;
    }
}

module.exports = StringTemplateBuilder;
