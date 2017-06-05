import * as _ from 'lodash';

/**
 * Standard room class that contains basic functionality for rooms we can observe
 */
export abstract class PlRoom {

    room: Room

    // Populated externally for efficiency
    creeps: { [creepName: string]: Creep } = {};
    spawns: { [spawnName: string]: Spawn } = {};

    constructor(room: Room) {
        this.room = room

        // Initialize data (is this a waste?)
        if (Memory.rooms[room.name] == undefined) {
            Memory.rooms[room.name] = {};
        }
    }

    /**
     * Run proceessing on this room
     */
    abstract run(): void;

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