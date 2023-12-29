import { Room } from "../types/room";
import Members from "./Members";

type RoomProps = {
    username: string;
    room: Room;
    leaveRoom: () => void;
}

const RoomDash = ({ username, room, leaveRoom }: RoomProps) => {
    return (
        <div className='flex flex-col gap-3 w-fit'>
            <h1>{username} - {room.id}</h1>
            <button onClick={leaveRoom} className='border border-gray-500 px-3 py-2 rounded-lg mt-3 hover:bg-gray-900'>Leave RoomDash</button>
            <Members members={room.members} />
        </div>
    )
}

export default RoomDash;
