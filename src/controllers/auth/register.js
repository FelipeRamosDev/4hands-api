const Request = require('@models/RequestAPI');
const User = require('@models/collections/User');

const bodySchema = {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true }
};

module.exports = async function (req, res) {
    try {
        const request = new Request(req, bodySchema);
        const body = request.getBody();
        const newUser = await User.create(body);

        if (newUser instanceof Error.Log) {
            return res.status(500).send(newUser.toJSON());
        }

        const toPublic = newUser.data.toPublic();
        toPublic.token = newUser.data.token;

        return res.status(200).send(toPublic.toSuccess().toJSON());
    } catch(err) {
        return res.status(500).send(new Error.Log(err).toJSON());
    }
}
