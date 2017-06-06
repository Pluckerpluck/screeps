type CreepRole = "worker" | "builder";
type CreepTask = "harvest";

interface CreepMemory {
    role: CreepRole;
    task: CreepTask;
    source: string;
    upgrading: boolean;
    spawnRoom: string;
}

interface FlagMemory { [name: string]: any; }
interface SpawnMemory { [name: string]: any; }
interface RoomMemory { [name: string]: any; }
