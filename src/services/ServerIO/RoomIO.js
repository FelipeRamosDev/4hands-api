/**
 * Class representing a RoomIO.
 */
class RoomIO {
    /**
     * Create a RoomIO.
     * @param {Object} setup - The setup object.
     * @param {string} setup.id - The RoomIO unique identification.
     * @param {string} setup.name - The room name.
     * @param {boolean} setup.isPrivate - If the the connection private room.
     * @param {string[]} setup.participants - Arry of participants connections.
     * @param {Object} serverIO - The serverIO object.
     */
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

    /**
     * Get the serverIO.
     * @return {Object} The serverIO object.
     */
    get serverIO() {
        return this._serverIO();
    }

    /**
     * Join a participant to the room.
     * @param {string} participantID - The ID of the participant.
     * @return {Object} The RoomIO object.
     */
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

    /**
     * Remove a participant from the room.
     * @param {string} participantID - The ID of the participant.
     */
    leave(participantID) {
        const participantIndex = this.participants.indexOf(participantID);

        if (participantIndex > -1) {
            this.participants = this.participants.splice(participantIndex, participantID + 1);
        }
    }
}

module.exports = RoomIO;
