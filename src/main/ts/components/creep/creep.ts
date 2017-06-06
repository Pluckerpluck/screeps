export abstract class PlCreep {

    protected creep: Creep;

    constructor(creep: Creep) {
        this.creep = creep;
    }

    public abstract run(): void;

}
