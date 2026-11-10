import { Routes, Route } from "react-router-dom";
import Lobby from "./pages/Lobby.jsx";
import BoardPage from "./pages/BoardPage.jsx";
import HostPanel from "./pages/HostPanel.jsx";
import JoinScreen from "./pages/JoinScreen.jsx";
import PlayerView from "./pages/PlayerView.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Lobby />} />              {/* projector: join codes */}
      <Route path="/board" element={<BoardPage />} />     {/* projector: the game */}
      <Route path="/host" element={<HostPanel />} />      {/* you, with the PIN */}
      <Route path="/play" element={<JoinScreen />} />     {/* phones: enter code */}
      <Route path="/play/ready" element={<PlayerView />} />
    </Routes>
  );
}