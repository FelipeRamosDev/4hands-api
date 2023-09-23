async function defaultPopulate() {
    const populateConfig = [
        {
            path: 'auth',
            model: 'auth_buckets'
        },
        {
            path: 'spaceDesks',
            model: 'space_desks'
        },
        {
            path: 'tickets',
            model: 'tickets'
        },
        {
            path: 'tasks',
            model: 'tasks'
        }
    ];

    return this.populate(populateConfig);
}

module.exports = {
    defaultPopulate
}
