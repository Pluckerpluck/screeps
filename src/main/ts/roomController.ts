import { PlHub } from "./components/room/hub"

export class RoomController {

    rooms: { [roomName: string]: PlHub } = {};

    constructor() {
        this.rooms = this._getRooms();
        this._populateCreeps();
        this._populateSpawns();
    }

    /**
     * Notify the spawning room of this creeps death
     * @param creep The creep that has died
     */
    notifyDeath(creep: Creep) {
        let room = creep.memory.spawnRoom;
    }

    /**
     * Returns all the rooms visible to the player as PlRooms
     */
    private _getRooms(): { [roomName: string]: PlHub } {
        let rooms: { [key: string]: PlHub } = {};

        for (let roomName in Game.rooms) {
            let room = Game.rooms[roomName];
            rooms[roomName] = new PlHub(room);
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