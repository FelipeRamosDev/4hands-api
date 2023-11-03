const Component = require('@interface/Component');
const ImageTemplate = require('4hands-api/src/templates/Image');

/**
 * Represents an email confirmation component extending the base Component class.
 * @class
 * @extends Component
 */
class EmailResetPassword extends Component {
    get SOURCE_PATH() {
        return require.resolve('./ResetPassword.html');
    }

    /**
     * Constructs an instance of EmailResetPassword with the provided settings.
     * @constructor
     * @param {Object} settings - Configuration settings for the email confirmation component.
     * @param {string} settings.userEmail - User's email address for confirmation.
     * @param {string} settings.projectLogoURL - URL of the project logo to be displayed in the email.
     * @param {string} settings.customTitle - Custom title for the email confirmation message (optional).
     * @param {string} settings.customMessage - Custom message content for the email confirmation (optional).
     * @param {string} settings.resetURL - URL for confirming the user's email address.
     * @param {string} settings.containerCSS - CSS class for styling the email container (optional).
     * @param {string} settings.messageWrapCSS - CSS class for styling the message wrapper (optional).
     * @param {string} settings.textMessageCSS - CSS class for styling the text message (optional).
     * @param {string} settings.titleCSS - CSS class for styling the text message (optional).
     * @param {string} settings.buttonCSS - CSS class for styling the confirmation button (optional).
     */
    constructor(settings) {
        super(settings);

        const {
            userEmail,
            projectLogoURL,
            customTitle,
            customMessage,
            resetURL,
            containerCSS,
            messageWrapCSS,
            textMesssageCSS,
            titleCSS,
            buttonCSS
        } = Object(settings);

        this.projectLogoURL = projectLogoURL;
        this.resetURL = resetURL;
        this.containerCSS = containerCSS;
        this.messageWrapCSS = messageWrapCSS;
        this.textMesssageCSS = textMesssageCSS;
        this.titleCSS = titleCSS;
        this.buttonCSS = buttonCSS;
        this.projectLogo = new ImageTemplate({ src: projectLogoURL, alt: 'Project Logo' });

        if (customTitle) {
            this.title = customTitle;
        } else {
            this.title = 'You have requested to reset your password!';
        }

        if (customMessage) {
            this.message = customMessage;
        } else {
            this.message = `Click on the button below to create a new password for your account (${userEmail}):`;
        }
    }
}

module.exports = EmailResetPassword;
