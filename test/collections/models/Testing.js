class Testing {
    constructor(setup) {
        try {
            const { testName, isTested } = Object(setup);

            this.testName = testName;
            this.isTested = isTested;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Testing;
