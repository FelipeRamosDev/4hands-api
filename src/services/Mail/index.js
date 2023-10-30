const nodemailer = require('nodemailer');
const EmailConfirmation = require('@src/templates/EmailConfirmation');

class MailService {
    constructor(setup) {
        const { type, host, smtpPort, isSecure, emailUser, emailPassword } = Object(setup);

        this.options;

        try {
            switch (type) {
                case 'smtp': {
                    this.options = {
                        host,
                        port: Number(smtpPort || 465),
                        secure: false,
                        auth: {
                            user: emailUser,
                            pass: emailPassword
                        },
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
                    throw new Error.Log('common.bad_format_param', 'type', 'MailService.constructor', 'smpt | gmail', type);
                }
            }

            this.transporter = nodemailer.createTransport(this.options);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async send(to, subject, body, cc) {
        return new Promise((resolve, reject) => {
            this.transporter.sendMail({ to, subject, cc, html: body }, (err, info) => {
                if (err) {
                    return reject(err);
                }

                return resolve({ success: true, info });
            });
        });
    }

    async sendConfirmation(userEmail, confirmationURL, options) {
        const { customSubject } = Object(options);

        try {
            const body = new EmailConfirmation({
                userEmail,
                confirmationURL,
                ...Object(options)
            }).renderToString();

            return await this.send(userEmail, customSubject || 'Confirmation Email', body);
        } catch (err) {
            return new Error.Log(err);
        }
    }
}

module.exports = MailService;
