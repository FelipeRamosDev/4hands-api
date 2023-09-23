module.exports = async (req, res) => {
    res.status(200).send({
        success: true,
        state: 'online'
    });
}
