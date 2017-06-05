import {RoomController} from "./roomController"

function mloop() {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Initialize data (is this a waste?)
    if (Memory.rooms == undefined) {
        Memory.rooms = {};
    }

    let roomController = new RoomController();

    for (let roomName in roomController.rooms) {
        let room = roomController.rooms[roomName];
        room.run();
    }

    //console.log("Used" + Game.cpu.getUsed())
}

export const loop = mloop 