import { PlHub } from "./components/room/hub";

export class RoomController {

	// TODO: Change this
	public rooms: { [roomName: string]: PlHub } = {};

	constructor() {
		this.rooms = this._getRooms();
		this._populateCreeps();
		this._populateSpawns();
	}

	/**
	 * Notify the spawning room of this creeps death
	 * @param creep The creep that has died
	 */
	public notifyDeath(memory: CreepMemory) {
		if (Memory.rooms[memory.spawnRoom].sources) {
			delete Memory.rooms[memory.spawnRoom].sources[memory.source];
		}
	}

	/**
	 * Returns all the rooms visible to the player as PlRooms
	 */
	private _getRooms(): { [roomName: string]: PlHub } {
		const rooms: { [key: string]: PlHub } = {};

		_.forOwn(Game.rooms, (room, roomName) => {
			rooms[roomName] = new PlHub(room);
		});
		return rooms;
	}

	private _populateCreeps(): void {
		_.forOwn(Game.creeps, (creep, creepName) => {
			this.rooms[creep.room.name].add(creep);
		});
	}

	private _populateSpawns(): void {
		_.forOwn(Game.spawns, (spawn, spawnName) => {
			this.rooms[spawn.room.name].add(spawn);
		});
	}
}
