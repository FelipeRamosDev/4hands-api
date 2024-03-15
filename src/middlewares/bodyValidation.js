const Request = require('4hands-api/src/models/RequestAPI');

module.exports = (req, res, next, bodySchema) => {
    try {
        const request = new Request(req, bodySchema);
        
        req.body = request.getBody();
        return next();
    } catch (err) {
        return res.status(400).send(err);
    }
}
