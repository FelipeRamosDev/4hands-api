const Component = require('@interface/Component');

class ImageTemplate extends Component {
    get SOURCE_PATH() {
        return require.resolve('./Image.html');
    }

    constructor(settings) {
        super(settings);

        const { src, alt } = Object(settings);
        
        this.src = src;
        this.alt = alt;
    }
}

module.exports = ImageTemplate;
