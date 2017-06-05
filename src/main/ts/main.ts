import {RoomController} from "./roomController"

function mloop() {

    // Initialize data (is this a waste?)
    if (!Memory.rooms) {
        Memory.rooms = {};
    }

    let roomController = new RoomController();

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            roomController.notifyDeath(Game.creeps[name]);
            delete Memory.creeps[name];
            console.log('Creep has died:', name);
        }
    }

    for (let roomName in roomController.rooms) {
        let room = roomController.rooms[roomName];
        room.run();
    }

    //console.log("Used" + Game.cpu.getUsed())
}

export const loop = mloop 