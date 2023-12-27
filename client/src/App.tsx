import { useEffect, useState } from "react";
import { socket } from "./socket/socket";

const App = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        const onConnect = () => {
            setIsConnected(true);
        }

        const onDisconnect = () => {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        }
    }, [])

    return (
        <h1>Hello World - {String(isConnected)}</h1>
    )
}

export default App;
