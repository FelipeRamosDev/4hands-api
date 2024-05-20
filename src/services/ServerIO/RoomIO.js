class RoomIO {
    constructor(setup, serverIO) {
        const {
            id,
            name,
            isPrivate = false,
            participants = []
        } = Object(setup);

        this._serverIO = () => serverIO;
        this.id = id;
        this.name = name || id;
        this.isPrivate = isPrivate;
        this.participants = participants;
    }

    get serverIO() {
        return this._serverIO();
    }

    join(participantID) {
        const socket = this.serverIO.getConnection(participantID);
        
        if (socket) {
            socket.join(this.id);

            // Push to the participants array if it's not there yet
            if (!this.participants.find(item => item === socket.id)) {
                this.participants.push(socket.id);
            }
        }

        return this;
    }

    leave(participantID) {
        const participantIndex = this.participants.indexOf(participantID);

        if (participantIndex > -1) {
            this.participants = this.participants.splice(participantIndex, participantID + 1);
        }
    }
}

module.exports = RoomIO;
