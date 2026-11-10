import { Routes, Route } from "react-router-dom";
import Lobby from "./pages/Lobby.jsx";
import JoinScreen from "./pages/JoinScreen.jsx";
import PlayerView from "./pages/PlayerView.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Lobby />} />            {/* projector */}
      <Route path="/play" element={<JoinScreen />} />    {/* phones: enter code */}
      <Route path="/play/ready" element={<PlayerView />} />
    </Routes>
  );
}