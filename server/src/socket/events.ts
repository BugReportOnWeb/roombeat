import { Socket } from "socket.io";
import { Room } from "../types/room";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const createRoom = (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    rooms: Room[],
    currentUser: string,
    room: Room
) => {
    rooms.push(room);
    currentUser = room.owner;
    socket.join(room.id);

    // DEGUGGING/LOGGING
    console.log(room.owner, socket.id, 'created and joined room', room.id);

    return null;
}

const leaveRoom = (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    rooms: Room[],
    currentUser: string,
    room: Room
) => {
    const isOwner = room.owner === currentUser;

    if (isOwner) {
        // Removing the complete room from rooms list
        rooms = rooms.filter(prevRoom => prevRoom.owner !== room.owner);
    } else {
        // Removing just the member from the room members list
        rooms = rooms.map(room => {
            return room.members.find(member => member === socket.id)
                ? { ...room, members: room.members.filter(member => member !== socket.id) }
                : room
        })
    }

    socket.leave(room.id)

    // DEGUGGING
    console.log(currentUser, socket.id, 'left room', room.id);
}

export { createRoom, leaveRoom }
