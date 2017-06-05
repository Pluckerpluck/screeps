export abstract class PlCreep {

    creep: Creep;

    constructor(creep: Creep) {
        this.creep = creep;
    }

    abstract run(): void;

}