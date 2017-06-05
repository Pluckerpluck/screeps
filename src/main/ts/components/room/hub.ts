import * as _ from 'lodash';

import { PlRoom } from "./room"

import { RoleUpgrader } from "../../role.upgrader"
import { RoleHarvester } from "../../role.harvester"
import { PlCreepBuilder } from "../creep/builder"

/**
 * A room that contains a spawn
 * 
 * Hubs are important for controlling creep movement and construction decisions
 */
export class PlHub extends PlRoom {

    constructor(room: Room) {
        super(room);
    }

    run(): void {
        let harvesters = _.filter(this.creeps, (creep) => creep.memory.role == 'harvester');
        let upgraders = _.filter(this.creeps, (creep) => creep.memory.role == 'upgrader');
        let builders = _.filter(this.creeps, (creep) => creep.memory.role == 'builder');

        let primarySpawn = this.spawns[Object.keys(this.spawns)[0]]

        var sources = this.room.find(FIND_SOURCES) as Source[];

        if (Memory.rooms[this.room.name].sourcesPathed == undefined) {
            for(let source of sources) {
                let path = primarySpawn.pos.findPathTo(source.pos);
                for(let step of path){
                    this.room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD)
                }
            }
            Memory.rooms[this.room.name].sourcesPathed = true;
        }

        let queue: string;
        if (harvesters.length < 1) {
            primarySpawn.createCreep([WORK, CARRY, MOVE], undefined, { role: 'harvester', source: 0 });
            queue = "harvester";
        }else if (upgraders.length < 1) {
            primarySpawn.createCreep([WORK, CARRY, MOVE], undefined, { role: 'upgrader' });
            queue = "upgrader";
        }else if (builders.length < 1) {
            primarySpawn.createCreep([WORK, CARRY, MOVE], undefined, { role: 'builder' });
            queue = "builder";
        } else if (harvesters.length < 2 * sources.length) {
            primarySpawn.createCreep([WORK, CARRY, MOVE], undefined, { role: 'harvester', source: 0 });
            queue = "harvester";
        }

        if (primarySpawn.spawning) {
            var spawningCreep = this.creeps[primarySpawn.spawning.name];
            primarySpawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                primarySpawn.pos.x + 1,
                primarySpawn.pos.y,
                { align: 'left', opacity: 0.8 });
        } else {
            primarySpawn.room.visual.text(
                '✋' + queue,
                primarySpawn.pos.x + 1,
                primarySpawn.pos.y,
                { align: 'left', opacity: 0.8 });
        }

        for (var name in this.creeps) {
            var creep = this.creeps[name];
            if (creep.memory.role == 'harvester') {
                RoleHarvester.run(creep);
            }
            else if (creep.memory.role == 'upgrader') {
                RoleUpgrader.run(creep);
            }
            else if (creep.memory.role == 'builder') {
                new PlCreepBuilder(creep).run();
            }
        }
    }

    /**
     * Adds an object into the room
     * @param object The creep or spawn to add
     */
    add(object: Creep | Spawn) {
        if (object instanceof Creep) {
            this.creeps[object.name] = object;
        } else {
            this.spawns[object.name] = object;
        }
    }

}