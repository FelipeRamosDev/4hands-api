class DeleteRes {
    constructor(deleted) {
        if (deleted.deletedCount) {
            this.deleted = true;
        } else {
            this.deleted = false;
        }
    }
}

module.exports = {
    response: DeleteRes
};
