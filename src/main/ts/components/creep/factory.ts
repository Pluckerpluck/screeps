import {PlCreep, PlCreepWorker} from "./creeps";

export abstract class PlCreepFactory {

    static wrap(creep: Creep): PlCreep {
        if (creep.memory.role == "worker") {
            return new PlCreepWorker(creep);
        }
    }

}