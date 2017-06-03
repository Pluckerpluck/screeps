import * as _ from 'lodash';

import { RoleUpgrader } from "../role.upgrader"
import { RoleHarvester } from "../role.harvester"


export class PlRoom {

    room: Room
    creeps: { [creepName: string]: Creep } = {};
    spawns: { [spawnName: string]: Spawn } = {};

    constructor(room: Room) {
        this.room = room
    }

    run(): void {
        var harvesters = _.filter(this.creeps, (creep) => creep.memory.role == 'harvester');

        let spawn = this.spawns[Object.keys(this.spawns)[0]]

        if (harvesters.length < 2) {
            var newName = spawn.createCreep([WORK, CARRY, MOVE], undefined, { role: 'harvester' });
        }

        if (spawn.spawning) {
            var spawningCreep = this.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1,
                spawn.pos.y,
                { align: 'left', opacity: 0.8 });
        }

        for (var name in this.creeps) {
            var creep = this.creeps[name];
            if (creep.memory.role == 'harvester') {
                RoleHarvester.run(creep);
            }
            if (creep.memory.role == 'upgrader') {
                RoleUpgrader.run(creep);
            }
        }
    }

    /**
     * Adds an object into the room
     * @param object The creep or spawn to add
     */
    add(object: Creep | Spawn) {
        if (object instanceof Creep){
            this.creeps[object.name] = object;
        } else {
            this.spawns[object.name] = object;
        }
    }


    /**
     * Returns the name of the room
     */
    getName(): string {
        return this.room.name;
    }

    /**
     * Compares the active room to a Screeps room object
     * 
     * @param room The room to compare
     */
    equals(room: Room): boolean {
        return this.room.name == room.name;
    }
}