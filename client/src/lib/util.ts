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

const delay = (miliseconds: number) => {
    return new Promise(resolve => {
        setTimeout(() => resolve('Done'), miliseconds);
    })
}

const millisToMinutesAndSeconds = (miliseconds: number) => {
  const minutes = Math.floor(miliseconds / 60000);
  const seconds = ((miliseconds % 60000) / 1000).toFixed(0);
  const time = minutes + 'min ' + (parseInt(seconds) < 10 ? '0' : '') + seconds + 'sec';
  return  time;
}

export { roomIdGenerator, delay, millisToMinutesAndSeconds };
