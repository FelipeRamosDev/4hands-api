const { ServerAPI } = require('../index');

const api = new ServerAPI();

api.listen(80, () => console.log('heeeey'));
