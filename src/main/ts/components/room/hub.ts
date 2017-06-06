import * as _ from "lodash";

import { PlRoom } from "./room";

import { PlCreepFactory } from "../creep/factory";

/**
 * A room that contains a spawn
 *
 * Hubs are important for controlling creep movement and construction decisions
 */
export class PlHub extends PlRoom {

    constructor(room: Room) {
        super(room);
    }

    public run(): void {
        const worker = _.filter(this.creeps, (creep) => creep.memory.role === "worker");

        const primarySpawn = this.spawns[Object.keys(this.spawns)[0]];

        const sources = this.room.find(FIND_SOURCES) as Source[];

        // Another initialization
        if (Memory.rooms[this.room.name].sources === undefined) {
            Memory.rooms[this.room.name].sources = {};

            const source = primarySpawn.pos.findClosestByPath(FIND_SOURCES) as Source;
            Memory.rooms[this.room.name].primarySource = source.id;
        }

        if (Memory.rooms[this.room.name].queue === undefined) {
            Memory.rooms[this.room.name].queue = [];
        }

        if (worker.length < sources.length && Memory.rooms[this.room.name].queue.length === 0) {
            // Find clean source
            let source: Source;
            for (source of sources) {
                // Source hasn't been claimed
                if (Memory.rooms[this.room.name].sources[source.id] === undefined) {
                    Memory.rooms[this.room.name].sources[source.id] = true;
                    break;
                }
            }
            const tmpWorker: any = {};
            tmpWorker["build"] = [WORK, CARRY, MOVE];
            tmpWorker["name"] = undefined;
            tmpWorker["memory"] = { role: "worker", task: "harvest", source: source.id, spawnRoom: this.room.name };
            Memory.rooms[this.room.name].queue.push(tmpWorker);
        }

        if (Memory.rooms[this.room.name].queue.length !== 0) {
            const creepSpawn = Memory.rooms[this.room.name].queue[0];
            if (primarySpawn.canCreateCreep(creepSpawn["build"]) === OK) {
                primarySpawn.createCreep(creepSpawn["build"], creepSpawn["name"], creepSpawn["memory"]);
                Memory.rooms[this.room.name].queue.pop();
            }
        }

        if (primarySpawn.spawning) {
            const spawningCreep = this.creeps[primarySpawn.spawning.name];
            primarySpawn.room.visual.text(
                "🛠️" + spawningCreep.memory.role,
                primarySpawn.pos.x + 1,
                primarySpawn.pos.y,
                { align: "left", opacity: 0.8 });
        } else {
            if (Memory.rooms[this.room.name].queue.length !== 0) {
                primarySpawn.room.visual.text(
                    "✋" + Memory.rooms[this.room.name].queue[0]["memory"].role,
                    primarySpawn.pos.x + 1,
                    primarySpawn.pos.y,
                    { align: "left", opacity: 0.8 });
            }
        }

        // Run all creeps
        _.forOwn(this.creeps, (creep, key) => {
            if (creep.memory.role === "worker") {
                PlCreepFactory.wrap(creep).run();
            }
        });
    }

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

}
