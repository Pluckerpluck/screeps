import * as _ from "lodash";

/**
 * Standard room class that contains basic functionality for rooms we can observe
 */
export abstract class PlRoom {

	protected room: Room;

	// Populated externally for efficiency
	protected creeps: { [creepName: string]: Creep } = {};
	protected spawns: { [spawnName: string]: Spawn } = {};

	constructor(room: Room) {
		this.room = room;

		// Initialize data (is this a waste?)
		if (Memory.rooms[room.name] === undefined) {
			Memory.rooms[room.name] = {};
		}
	}

	/**
	 * Run proceessing on this room
	 */
	public abstract run(): void;

	/**
	 * Adds an object into the room
	 * @param object The creep or spawn to add
	 */
	public add(object: Creep | Spawn) {
		if (object instanceof Creep) {
			this.creeps[object.name] = object;
		} else {
			this.spawns[object.name] = object;
		}
	}

	/**
	 * Returns the name of the room
	 */
	public getName(): string {
		return this.room.name;
	}

	/**
	 * Compares the active room to a Screeps room object
	 *
	 * @param room The room to compare
	 */
	public equals(room: Room): boolean {
		return this.room.name === room.name;
	}
}
