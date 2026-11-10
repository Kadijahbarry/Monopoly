import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import useGameState from "../hooks/useGameState";
import PlayerList from "../components/ui/PlayerList.jsx";

// The projector's home screen. Moves to the board automatically when the host starts the game.
export default function Lobby() {
  const navigate = useNavigate();
  const { game } = useGameState(() => socket.emit("displayJoin"));

  useEffect(() => {
    if (game && game.phase !== "lobby") navigate("/board");
  }, [game, navigate]);

  const teams = game ? [game.teams.red, game.teams.blue] : [];

  return (
    <main className="lobby">
      <h1 className="title">Monopoly Trivia</h1>
      <p className="subtitle">
        On your phone, go to <strong>{window.location.host}/play</strong> and enter your team's code.
        You can join any time.
      </p>

      <div className="deeds">
        {teams.map((t) => (
          <section key={t.id} className="deed">
            <header className={`deed-strip strip-${t.id}`}>{t.name}</header>
            <div className="deed-body">
              <p className="deed-label">Join code</p>
              <p className="deed-code">{t.code}</p>
              <p className="deed-count">
                {t.playerCount} {t.playerCount === 1 ? "player" : "players"}
              </p>
              <PlayerList players={t.players} />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}