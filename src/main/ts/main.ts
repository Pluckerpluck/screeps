import * as _ from "lodash";

import { RoomController } from "./roomController";

import * as profiler from "screeps-profiler";

profiler.enable();

function mloop() {

	if (Game.time % 50 === 0) {
		Game.profiler.profile(49);
	}

	// Initialize data (is this a waste?)
	if (!Memory.rooms) {
		Memory.rooms = {};
	}

	const roomController = new RoomController();

	for (const name in Memory.creeps) {
		if (!Game.creeps[name]) {
			roomController.notifyDeath(Game.creeps[name]);
			delete Memory.creeps[name];
			console.log("Creep has died:", name);
		}
	}

	_.forOwn(roomController.rooms, (room, roomName) => {
		room.run();
	});

	// console.log("Used" + Game.cpu.getUsed())
}

// export const loop = mloop
export const loop = profiler.wrap(mloop);
