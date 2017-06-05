export class RoleHarvester {

    static run(creep:Creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES) as Source[];
            if(creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.source], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure: Structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        (structure as Extension | Spawn).energy < (structure as Extension | Spawn).energyCapacity;
                }
            }) as Extension[] | Spawn[];
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
}
