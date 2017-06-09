import { PlRoom } from "./room";

import { PlCreepWorker, PlCreepWorkerState } from "../creep/creeps";
import { PlCreepFactory } from "../creep/factory";

export enum PlHubState {
	INITIALIZE, RCL1,
}

interface RoomMemory {
	queue: BodyPartConstant[];
}

/**
 * A room that contains a spawn
 *
 * Hubs are important for controlling creep movement and construction decisions
 */
export class PlHub extends PlRoom {

	private state = PlHubState.RCL1;

	constructor(room: Room) {
		super(room);
		if (Memory.rooms[room.name].state === undefined) {
			Memory.rooms[room.name].state = PlHubState.RCL1;
		}
		this.state = Memory.rooms[room.name].state;
	}

	public run(): void {

		switch (this.state) {
			case PlHubState.RCL1:
				this._rcl1_spawning();
				break;
		}

		// Run Spawning
		if (Memory.rooms[this.room.name].queue.length !== 0) {
			const spawn = this.spawns[_.keys(this.spawns)[0]];
			const creepSpawn = Memory.rooms[this.room.name].queue[0] as CreepSpawn;
			if (spawn.canCreateCreep(creepSpawn.body) === OK) {
				spawn.createCreep(creepSpawn.body, creepSpawn.name, creepSpawn.memory);
				Memory.rooms[this.room.name].queue.pop();
			}
		}

		// Run all creeps
		_.forOwn(this.creeps, (creep, key) => {
			creep.run();
		});

		this._visualize();
	}

	private _visualize() {
		_.forOwn(this.spawns, (spawn) => {
			if (spawn.spawning) {
				const spawningCreep = this.creeps[spawn.spawning.name];
				spawn.room.visual.text(
					"🛠️" + spawningCreep.creep.memory.role,
					spawn.pos.x + 1,
					spawn.pos.y,
					{ align: "left", opacity: 0.8 });
			} else {
				if (Memory.rooms[this.room.name].queue.length !== 0) {
					spawn.room.visual.text(
						"✋" + Memory.rooms[this.room.name].queue[0].memory.role,
						spawn.pos.x + 1,
						spawn.pos.y,
						{ align: "left", opacity: 0.8 });
				}
			}
		});
	}

	/**
	 * Code to run when at RCL 1
	 */
	private _rcl1_spawning() {

		// Initialize source memory
		if (Memory.rooms[this.room.name].sources === undefined) {
			Memory.rooms[this.room.name].sources = {};
		}

		// Initialize spawn queue
		if (Memory.rooms[this.room.name].queue === undefined) {
			Memory.rooms[this.room.name].queue = [];
		}

		const sources = this.room.find(FIND_SOURCES) as Source[];
		const workers = _.filter(this.creeps, (creep) => creep.creep.memory.role === "worker");

		// Only queue up a creep if nothing  is going on
		if (workers.length < sources.length && Memory.rooms[this.room.name].queue.length === 0) {
			// Find an unclaimed source to harvest
			let source: Source;
			for (source of sources) {
				if (Memory.rooms[this.room.name].sources[source.id] === undefined) {
					Memory.rooms[this.room.name].sources[source.id] = true;
					break;
				}
			}

			const worker: CreepSpawn = {
				body: [WORK, CARRY, MOVE],
				memory: {
					role: "worker",
					source: source.id,
					spawnRoom: this.room.name,
					state: PlCreepWorkerState.HARVESTING,
					task: "harvest",
				},
			};

			Memory.rooms[this.room.name].queue.push(worker);
		} else if (workers.length === sources.length && Memory.rooms[this.room.name].flag === undefined) {
			Memory.rooms[this.room.name].flag = true;
			const closestSource = this.room.controller.pos.findClosestByPath<Source>(FIND_SOURCES);
			const mainCreep = _.find(workers, (creep) => {
				return creep.creep.memory.source === closestSource.id;
			}) as PlCreepWorker;
			mainCreep.changeTask("upgrade");
		}
	}
}
