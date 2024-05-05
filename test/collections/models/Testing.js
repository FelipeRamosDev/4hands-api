class Testing {
    constructor(setup) {
        try {
            const { testName, isTested } = Object(setup);

            this.testName = testName;
            this.isTested = isTested;
        } catch (err) {
            throw logError(err);
        }
    }
}

module.exports = Testing;
