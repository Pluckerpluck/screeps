type CreepRole = "worker" | "builder";
type CreepTask = "harvest" | "upgrade";

interface CreepMemory {
	role: CreepRole;
	state?: number;
	source: string;
	spawnRoom: string;
	task: CreepTask;
}

interface FlagMemory { [name: string]: any; }
interface SpawnMemory { [name: string]: any; }

interface RoomMemory {
	state?: number;
	queue?: CreepSpawn[];
	[name: string]: any;
}

interface CreepSpawn {
	body: BodyPartConstant[];
	name?: string;
	memory: CreepMemory;
}
