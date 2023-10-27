const nodemailer = require('nodemailer');

class MailService {
    constructor(setup) {
        const { type, smtpHost, smtpPort, isSecure, smtpUser, smtpPassword } = Object(setup);

        try {
            switch (type) {
                case 'smtp': {
                    this.transporter = nodemailer.createTransport({
                        host: smtpHost,
                        port: smtpPort || 587,
                        secure: isSecure || false,
                        auth: {
                            user: smtpUser,
                            pass: smtpPassword,
                        }
                    });

                    break;
                }

                case 'gmail': {
                    console.log('Sending Gmail...');
                    break;
                }

                default: {
                    throw new Error.Log('common.bad_format_param', 'type', 'MailService.constructor', 'smpt | gmail', type);
                }
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async send(to, subject, cc, body) {
        try {
            return new Promise((resolve, reject) => {
                this.transporter.sendMail({ to, subject, cc, body }, (err, info) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(info);
                });
            });
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = MailService;
