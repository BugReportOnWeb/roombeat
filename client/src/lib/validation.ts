const validateUsername = (username: string) => {
    if (!username.trim()) {
        const error = 'Invalid username.';
        return error;
    }
    if (username.trim().length < 2) {
        const error = 'Username must be at least 2 characters.';
        return error;
    }
}

// TODO?: Another lib section for them?
const checkAvailableRoom = async (roomId: string) => {
    const res = await fetch(`http://localhost:3000/api/rooms/${roomId}`);
    if (res.status === 404) return false;
    return true;
}

const checkExistingMember = async (username: string) => {
    const res = await fetch(`http://localhost:3000/api/users/${username}`);
    if (res.status === 200) return true;
    return false;
}

const validateRoomId = async (
    username: string,
    roomId: string | undefined
) => {
    // Length: Only when using 'roomIdGeneretor()'
    if (!roomId?.trim() || roomId.trim().length < 5) {
        const error = 'Invalid Room ID';
        return error;
    }

    const room = await checkAvailableRoom(roomId);
    if (!room) {
        const error = `Room '${roomId}' doesn't exist`;
        return error;
    }

    const member = await checkExistingMember(username);
    if (member) {
        const error = `Username '${username}' unavailable for room '${roomId}'`;
        return error;
    }
}

export { validateUsername, validateRoomId };
