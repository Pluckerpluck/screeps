import { PlCreep } from "./creep";

export enum PlTask {
	HARVEST, BUILD, UPGRADE,
}

export enum PlCreepWorkerState {
	SEARCHING, HARVESTING, DEPOSITING, UPGRADING, BUILDING, MOVING,
}

/**
 * General purpose creep, used in the early game
 */
export class PlCreepWorker extends PlCreep {

	private state: PlCreepWorkerState = PlCreepWorkerState.HARVESTING;

	constructor(creep: Creep) {
		super(creep);
		this.state = creep.memory.state as PlCreepWorkerState;
	}

	public run() {
		switch (this.state) {
			case PlCreepWorkerState.HARVESTING:
				this._harvest();
				break;
			case PlCreepWorkerState.DEPOSITING:
				this._deposit();
				break;
			case PlCreepWorkerState.UPGRADING:
				this._upgrade();
				break;
			case PlCreepWorkerState.BUILDING:
				this._build();
				break;
		}
	}

	/**
	 * Changes the workers task
	 * @param task The new task to enact
	 */
	public changeTask(task: CreepTask): void {
		this.creep.memory.task = task;
	}

	/**
	 * Changes the workers state
	 * @param state The new state to enact
	 */
	public changeState(state: PlCreepWorkerState): void {
		this.creep.memory.state = state;
		this.state = state;
	}

	private _harvest() {
		if (this.creep.harvest(Game.getObjectById(this.creep.memory.source) as Source) === ERR_NOT_IN_RANGE) {
			this.creep.moveTo(
				Game.getObjectById(
					this.creep.memory.source) as Source,
				{ visualizePathStyle: { stroke: "#ffaa00" }, reusePath: 50 });
		}

		// Run next task
		if (this.creep.carry.energy >= this.creep.carryCapacity) {
			switch (this.creep.memory.task) {
				case "harvest":
					this.changeState(PlCreepWorkerState.BUILDING);
					break;
				case "upgrade":
					this.changeState(PlCreepWorkerState.UPGRADING);
					break;
			}
		}
	}

	private _upgrade() {
		const controller = this.creep.room.controller;
		const status = this.creep.upgradeController(controller);
		if (status === ERR_NOT_IN_RANGE) {
			this.creep.moveTo(controller, { visualizePathStyle: { stroke: "#ffffff" }, reusePath: 50 });
		}

		if (this.creep.carry.energy === 0) {
			this.changeState(PlCreepWorkerState.HARVESTING);
		}
	}

	private _deposit() {
		const targets = this.creep.room.find(FIND_STRUCTURES, {
			filter: (structure: Structure) => {
				return (
					structure.structureType === STRUCTURE_EXTENSION ||
					structure.structureType === STRUCTURE_SPAWN) &&
					(structure as Extension | Spawn).energy < (structure as Extension | Spawn).energyCapacity;
			},
		}) as Extension[] | Spawn[];
		if (targets.length > 0) {
			const status = this.creep.transfer(targets[0], RESOURCE_ENERGY);
			if (status === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" }, reusePath: 50 });
			} else if (status === OK) {
				this.changeState(PlCreepWorkerState.HARVESTING);
			}
		} else {
			this.changeState(PlCreepWorkerState.BUILDING);
		}
	}

	private _build() {
		const targets = this.creep.room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES);
		if (targets.length > 0) {
			const status = this.creep.build(targets[0]);
			if (status === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" }, reusePath: 50 });
			}
			if (this.creep.carry.energy === 0) {
				this.changeState(PlCreepWorkerState.HARVESTING);
			}
		} else {
			this.changeState(PlCreepWorkerState.DEPOSITING);
			this.run();
		}
	}

}
