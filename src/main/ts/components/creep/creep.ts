export abstract class PlCreep {

	public creep: Creep;

	constructor(creep: Creep) {
		this.creep = creep;
	}

	public abstract run(): void;

}
