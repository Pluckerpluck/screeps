import { PlCreep } from "./creep";

export class PlCreepBuilder extends PlCreep {

	public run() {
		if (this.creep.memory.upgrading && this.creep.carry.energy === 0) {
			this.creep.memory.upgrading = false;
			this.creep.say("🔄 harvest");
		}
		if (!this.creep.memory.upgrading && this.creep.carry.energy === this.creep.carryCapacity) {
			this.creep.memory.upgrading = true;
			this.creep.say("⚡ build");
		}

		if (this.creep.memory.upgrading) {
			const site = this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES) as ConstructionSite;
			if (this.creep.build(site) === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(site, { visualizePathStyle: { stroke: "#ffffff" } });
			}
		} else {
			const sources = this.creep.room.find(FIND_SOURCES) as Source[];
			if (this.creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
			}
		}
	}
}
