import { RoomController } from "./roomController";

import * as profiler from "screeps-profiler";

profiler.enable();

function mloop() {

	// Initialize data (is this a waste?)
	if (!Memory.rooms) {
		Memory.rooms = {};
	}

	const roomController = new RoomController();

	for (const name in Memory.creeps) {
		if (!Game.creeps[name]) {
			// roomController.notifyDeath(Memory.creeps[name]);
			delete Memory.creeps[name];
			console.log("Creep has died:", name);
		}
	}

	_.forOwn(roomController.rooms, (room, roomName) => {
		room.run();
	});

	// console.log("Used" + Game.cpu.getUsed())
}

function tryWrap() {
		mloop();
}

// export const loop = mloop
export const loop = profiler.wrap(tryWrap);
