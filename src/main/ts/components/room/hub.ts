import * as _ from 'lodash';

import { PlRoom } from "./room"

import { PlCreepFactory } from "../creep/factory"


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
        let worker = _.filter(this.creeps, (creep) => creep.memory.role == 'worker');

        let primarySpawn = this.spawns[Object.keys(this.spawns)[0]]

        var sources = this.room.find(FIND_SOURCES) as Source[];
        primarySpawn.pos.findClosestByPath(FIND_SOURCES)

        // Another initialization
        if (Memory.rooms[this.room.name].sources == undefined) {
            Memory.rooms[this.room.name].sources = {}

            let source = primarySpawn.pos.findClosestByPath(FIND_SOURCES) as Source;
            Memory.rooms[this.room.name].primarySource = source.id;
        }

        if (Memory.rooms[this.room.name].queue == undefined) {
            Memory.rooms[this.room.name].queue = [];
        }

        if (worker.length < sources.length && Memory.rooms[this.room.name].queue.length == 0) {
            // Find clean source
            let source: Source;
            for (source of sources) {
                // Source hasn't been claimed
                if (Memory.rooms[this.room.name].sources[source.id] == undefined) {
                    Memory.rooms[this.room.name].sources[source.id] = true
                    break
                }
            }
            let worker: any  = {}
            worker["build"]= [WORK, CARRY, MOVE];
            worker["name"] = undefined;
            worker["memory"] = { role: 'worker', task: 'harvest', source: source.id, spawnRoom: this.room.name }
            Memory.rooms[this.room.name].queue.push(worker);
        }

        if (Memory.rooms[this.room.name].queue.length != 0) {
            let creepSpawn = Memory.rooms[this.room.name].queue[0];
            if (primarySpawn.canCreateCreep(creepSpawn["build"]) == OK) {
                primarySpawn.createCreep(creepSpawn["build"], creepSpawn["name"], creepSpawn["memory"]);
                Memory.rooms[this.room.name].queue.pop();
            }
        }



        if (primarySpawn.spawning) {
            var spawningCreep = this.creeps[primarySpawn.spawning.name];
            primarySpawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                primarySpawn.pos.x + 1,
                primarySpawn.pos.y,
                { align: 'left', opacity: 0.8 });
        } else {
            if (Memory.rooms[this.room.name].queue.length != 0) {
                primarySpawn.room.visual.text(
                    '✋' + Memory.rooms[this.room.name].queue[0]["memory"].role,
                    primarySpawn.pos.x + 1,
                    primarySpawn.pos.y,
                    { align: 'left', opacity: 0.8 });
            }
        }

        // Run all creeps
        for (var name in this.creeps) {
            var creep = this.creeps[name];
            if (creep.memory.role == "worker") {
                PlCreepFactory.wrap(creep).run();
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