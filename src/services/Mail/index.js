const nodemailer = require('nodemailer');
const EmailConfirmation = require('../../templates/emails/EmailConfirmation');
const ResetPassword = require('../../templates/emails/ResetPassword');

/**
 * Represents a Mail Service that utilizes nodemailer to send emails and handle email confirmation functionality.
 * @class
 */
class MailService {
    /**
     * Creates an instance of MailService.
     *
     * @constructor
     * @param {Object} setup - Configuration object for the mail service.
     * @param {string} setup.type - Type of email service ('smtp' or 'gmail').
     * @param {string} setup.host - Hostname for the SMTP server (for 'smtp' type).
     * @param {number} setup.smtpPort - Port number for the SMTP server (for 'smtp' type). Default is 465.
     * @param {boolean} setup.isSecure - Indicates whether the connection is secure (for 'smtp' type).
     * @param {string} setup.emailUser - User email for authentication.
     * @param {string} setup.emailPassword - Password for authentication.
     * @param {boolean} setup.signUpConfirmationEmail - To set if you like to send a confirmation e-mail when the user sign-up.
     * @throws Will throw an error if the provided email service type is neither 'smtp' nor 'gmail'.
     */
    constructor(setup) {
        const { type, host, smtpPort, isSecure, emailUser, emailPassword, signUpConfirmationEmail } = Object(setup);

        this.options;
        this.signUpConfirmationEmail = signUpConfirmationEmail;

        try {
            switch (type) {
                case 'smtp': {
                    this.options = {
                        host,
                        port: Number(smtpPort || 587),
                        secure: false, // true for port 465, false for other ports
                        auth: {
                            user: emailUser,
                            pass: emailPassword
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    };

                    break;
                }

                case 'gmail': {
                    this.options = {
                        service: 'gmail',
                        secure: isSecure || false,
                        auth: {
                            user: emailUser,
                            pass: emailPassword,
                        },
                        tls: {
                            rejectUnauthorized: isSecure || false
                        }
                    };
                    break;
                }

                default: {
                    throw logError('common.bad_format_param', 'type', 'MailService.constructor', 'smpt | gmail', type);
                }
            }

            this.transporter = nodemailer.createTransport(this.options);
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Sends an email using the configured email service.
     *
     * @async
     * @method
     * @param {string} to - Recipient email address.
     * @param {string} subject - Email subject.
     * @param {string} body - Email body content (HTML format).
     * @param {string} cc - Email address to be CC'd (optional).
     * @returns {Promise<Object>} A Promise that resolves to an object indicating the success of the email sending operation.
     * @throws Will throw an error if the email sending operation fails.
     */
    async send(to, subject, body, cc) {
        return new Promise((resolve, reject) => {
            this.transporter.sendMail({ from: this.options.auth.user, to, subject, cc, html: body }, (err, info) => {
                if (err) {
                    return reject(err);
                }

                return resolve({ success: true, info });
            });
        });
    }

    /**
     * Sends a confirmation email to a user with a specified confirmation URL.
     *
     * @async
     * @method
     * @param {string} userEmail - User's email address.
     * @param {string} confirmationURL - URL for confirming the user's email address.
     * @param {Object} options - Additional options for customizing the confirmation email (optional).
     * @param {string} options.customSubject - Custom subject for the confirmation email (optional).
     * @param {string} options.projectLogoURL - URL of the project logo to be displayed in the email.
     * @param {string} options.customTitle - Custom title for the email confirmation message (optional).
     * @param {string} options.customMessage - Custom message content for the email confirmation (optional).
     * @param {string} options.containerCSS - CSS class for styling the email container (optional).
     * @param {string} options.messageWrapCSS - CSS class for styling the message wrapper (optional).
     * @param {string} options.textMessageCSS - CSS class for styling the text message (optional).
     * @param {string} options.buttonCSS - CSS class for styling the confirmation button (optional).
     * @returns {Promise<Object>} A Promise that resolves to an object indicating the success of the email sending operation.
     * @throws Will throw an error if the email sending operation fails.
     */
    async sendConfirmation(userEmail, confirmationURL, options) {
        const { customSubject, projectLogoURL } = Object(options);

        if (!this.signUpConfirmationEmail) {
            return logError({
                name: 'DONT_SEND_CONFIRMATION',
                message: `API configured to don't send a confirmation email.`
            });
        }

        try {
            const body = new EmailConfirmation({
                customTitle: 'Welcome to CandlePilot',
                customMessage: 'We\'re excited to have you on board! The final step before you can start using CandlePilot is to confirm your email. Please click the button below to verify your email address.',
                projectLogoURL,
                userEmail,
                confirmationURL,
                ...Object(options)
            }).renderToString();

            return await this.send(userEmail, customSubject || 'Confirmation Email', body);
        } catch (err) {
            return logError(err);
        }
    }

    /**
     * Sends a confirmation email to a user with a specified confirmation URL.
     *
     * @async
     * @method
     * @param {string} userEmail - User's email address.
     * @param {string} resetURL - URL for sending the reset password email email address.
     * @param {Object} options - Additional options for customizing the confirmation email (optional).
     * @param {string} options.customSubject - Custom subject for the confirmation email (optional).
     * @param {string} options.projectLogoURL - URL of the project logo to be displayed in the email.
     * @param {string} options.customTitle - Custom title for the email confirmation message (optional).
     * @param {string} options.customMessage - Custom message content for the email confirmation (optional).
     * @param {string} options.containerCSS - CSS class for styling the email container (optional).
     * @param {string} options.messageWrapCSS - CSS class for styling the message wrapper (optional).
     * @param {string} options.textMessageCSS - CSS class for styling the text message (optional).
     * @param {string} options.buttonCSS - CSS class for styling the confirmation button (optional).
     * @returns {Promise<Object>} A Promise that resolves to an object indicating the success of the email sending operation.
     * @throws Will throw an error if the email sending operation fails.
     */
    async sendResetPassword(userEmail, resetURL, options) {
        const { customSubject } = Object(options);

        try {
            const body = new ResetPassword({
                userEmail,
                resetURL
            });

            return await this.send(userEmail, customSubject || body.title, body.renderToString());
        } catch (err) {
            throw logError(err);
        }
    }
}

module.exports = MailService;
