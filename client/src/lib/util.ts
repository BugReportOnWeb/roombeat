const roomIdGenerator = () => {
    const alphabetGen = () => {
        return Math.floor((Math.random() * (26 - 1) + 1)) + 64;
    }

    const roomId = String.fromCharCode(
        alphabetGen(),
        alphabetGen(),
        alphabetGen(),
        alphabetGen(),
        alphabetGen()
    );

    return roomId;
}

export { roomIdGenerator };
