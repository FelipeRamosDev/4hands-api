async function getCacheModel(collection, uid, Model) {
    if (!Model) return;

    const cache = await Model.getCache(collection, uid);

    if (!cache) {
        return;
    }

    return new Model(cache);
}

module.exports = {
    getCacheModel
}
