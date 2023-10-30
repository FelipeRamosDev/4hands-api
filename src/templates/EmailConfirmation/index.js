const Component = require('@interface/Component');

class EmailConfirmation extends Component {
    get SOURCE_PATH() {
        return require.resolve('./EmailConfirmation.html');
    }

    constructor(settings) {
        super(settings);

        const {
            userEmail,
            projectLogoURL,
            customTitle,
            customMessage,
            confirmationURL,
            containerCSS,
            messageWrapCSS,
            textMesssageCSS,
            buttonCSS
        } = Object(settings);

        this.projectLogoURL = projectLogoURL;
        this.confirmationURL = confirmationURL;
        this.containerCSS = containerCSS;
        this.messageWrapCSS = messageWrapCSS;
        this.textMesssageCSS = textMesssageCSS;
        this.buttonCSS = buttonCSS;

        if (customTitle) {
            this.title = customTitle;
        } else {
            this.title = 'E-mail Confirmation';
        }

        if (customMessage) {
            this.message = customMessage;
        } else {
            this.message = `Click on the button below to confirm your email (${userEmail}):`;
        }
    }
}

module.exports = EmailConfirmation;
