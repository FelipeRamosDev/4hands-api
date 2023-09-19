const Prompt = require('@services/Prompt');
const prompt = new Prompt({
    rootPath: process.cwd('dir').replace(new RegExp(/\\/, 'g'), '/')
});

/**
 * Class representing a command-line interface screen helper.
 */
class ScreenHelperCLI {
    constructor() {
        this.charWidthInPixels = 7;
    }
  
    /**
     * Get the screen pixel width.
     * @returns {number} The screen pixel width.
     * @throws {Error.Log} If an error occurs while executing the command.
     */
    screenPixelWitdh() {
        const command = `powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Width"`;
        const width = prompt.cmd(command);

        if (width instanceof Error.Log) {
            throw width;
        }

        const output = width.out.trim();
        const screenPixelWidth = parseInt(output);

        return screenPixelWidth;
    }

    /**
     * Get the screen character width.
     * @param {number} [charWidthInPixels=this.charWidthInPixels] - The character width in pixels.
     * @returns {number} The screen character width.
     */
    screenCharWitdh(charWidthInPixels = this.charWidthInPixels) {
        const screenPixelWidth = this.screenPixelWitdh();
        const screenCharacterWidth = this.pixelToChar(screenPixelWidth, charWidthInPixels);

        return screenCharacterWidth;
    }

    /**
     * Convert pixels to characters.
     * @param {number} pixels - The number of pixels to convert.
     * @param {number} [charWidthInPixels=this.charWidthInPixels] - The character width in pixels.
     * @returns {number} The number of characters.
     */
    pixelToChar(pixels, charWidthInPixels = this.charWidthInPixels) {
        return Math.floor(pixels / (charWidthInPixels || this.charWidthInPixels || 7));
    }

    /**
     * Convert percent to characters.
     * @param {number} percent - The percent to convert.
     * @param {number} [charWidthInPixels=this.charWidthInPixels] - The character width in pixels.
     * @returns {number} The number of characters.
     */
    percentToChar(percent, charWidthInPixels = this.charWidthInPixels) {
        const screenWidthPX = this.screenPixelWitdh();
        const pixelsToConvert = (percent * screenWidthPX) / 100;

        return this.pixelToChar(pixelsToConvert, charWidthInPixels);
    }
} 

/**
 * The singleton instance of the screen helper CLI.
 * @type {ScreenHelperCLI}
 */
module.exports = ScreenHelperCLI;
