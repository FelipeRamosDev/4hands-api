async function defaultPopulate() {
    const populateConfig = [
        {
            path: 'auth',
            model: 'auth_buckets'
        }
    ];

    return this.populate(populateConfig);
}

module.exports = {
    defaultPopulate
}
