// Core
import { Route, Routes } from 'react-router-dom';

// Pages
import Home from "./pages/Home";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";

// Context Providers
import { UsernameContextProvider } from "./context/UsernameContext";
import { RoomContextProvider } from "./context/RoomContext";

const App = () => {
    return (
        <UsernameContextProvider>
            <RoomContextProvider>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/create-room' element={<CreateRoom />} />
                    <Route path='/join-room' element={<JoinRoom />} />
                </Routes>
            </RoomContextProvider>
        </UsernameContextProvider>
    )
}

export default App;
