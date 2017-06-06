import { PlCreep } from "./creep";

export enum PlTask {
	HARVEST, BUILD, UPGRADE,
}

/**
 * General creep construction, used in the early game
 */
export class PlCreepWorker extends PlCreep {

	public run() {
		if (this.creep.carry.energy < this.creep.carryCapacity) {
			const sources = this.creep.room.find(FIND_SOURCES) as Source[];
			if (this.creep.harvest(Game.getObjectById(this.creep.memory.source) as Source) === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(
					Game.getObjectById(this.creep.memory.source) as Source,
					{ visualizePathStyle: { stroke: "#ffaa00" }, reusePath: 50 });
			}
		} else {
			const targets = this.creep.room.find(FIND_STRUCTURES, {
				filter: (structure: Structure) => {
					return (
						structure.structureType === STRUCTURE_EXTENSION ||
						structure.structureType === STRUCTURE_SPAWN) &&
						(structure as Extension | Spawn).energy < (structure as Extension | Spawn).energyCapacity;
				},
			}) as Extension[] | Spawn[];
			if (targets.length > 0) {
				if (this.creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
					this.creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" }, reusePath: 50 });
				}
			}
		}
	}

	/**
	 * Changes the workers task
	 * @param task The new task to enact
	 */
	public changeTask(task: CreepTask): void {
		this.creep.memory.task = task;
	}
}
