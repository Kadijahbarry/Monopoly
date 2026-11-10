import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import Button from "../components/ui/Button.jsx";
import { getPlayerId, loadSession, clearSession } from "../session";

// The phone screen after checking in. Questions will appear here later.
export default function PlayerView() {
  const navigate = useNavigate();
  const session = loadSession();
  const [game, setGame] = useState(null);

  useEffect(() => {
    const s = loadSession();
    if (!s) return navigate("/play", { replace: true });

    // Runs on first load AND every time the connection comes back.
    const join = () =>
      socket.emit("join", { code: s.code, name: s.name, playerId: getPlayerId() }, (res) => {
        if (!res?.ok) {
          clearSession();
          navigate("/play", { replace: true });
        } else {
          setGame(res.state);
        }
      });

    if (socket.connected) join();
    socket.on("connect", join);
    socket.on("state", setGame);
    return () => {
      socket.off("connect", join);
      socket.off("state", setGame);
    };
  }, [navigate]);

  if (!session) return null;
  const teamId = session.team.id;

  function leave() {
    clearSession();
    navigate("/play");
  }

  return (
    <main className={`player team-${teamId}`}>
      <section className="deed join-card">
        <header className={`deed-strip strip-${teamId}`}>{session.team.name}</header>
        <div className="deed-body">
          <p className="deed-label">You're in, {session.name}</p>
          <p className="waiting">Waiting for the host to start the next question.</p>
          {game && (
            <p className="deed-count">
              {game.teams[teamId].playerCount} on your team
            </p>
          )}
          <Button variant="cream" onClick={leave}>Switch team</Button>
        </div>
      </section>
    </main>
  );
}