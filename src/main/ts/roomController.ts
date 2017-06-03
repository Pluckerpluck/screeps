import { PlRoom } from "./components/room"

export class RoomController {

    rooms: { [roomName: string]: PlRoom } = {};

    constructor() {
        this.rooms = this._getRooms();
        this._populateCreeps();
        this._populateSpawns();
    }

    /**
     * Returns all the rooms visible to the player as PlRooms
     */
    private _getRooms(): { [roomName: string]: PlRoom } {
        let rooms: { [key: string]: PlRoom } = {};

        for (let roomName in Game.rooms) {
            let room = Game.rooms[roomName];
            rooms[roomName] = new PlRoom(room);
        }
        return rooms;
    }

    private _populateCreeps(): void {
        for (let creepName in Game.creeps) {
            let creep = Game.creeps[creepName]
            this.rooms[creep.room.name].add(creep);
        }
    }

    private _populateSpawns(): void {
        for (let spawnName in Game.spawns) {
            let spawn = Game.spawns[spawnName]
            this.rooms[spawn.room.name].add(spawn);
        }
    }
}