const ScreenHelperCLI = require('./screen');
const auth = require('./auth');

module.exports = {
    screen: (() => new ScreenHelperCLI())(),
    auth
}
