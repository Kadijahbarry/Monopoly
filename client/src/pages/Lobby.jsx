import { useEffect, useState } from "react";
import socket from "../socket";
import PlayerList from "../components/ui/PlayerList.jsx";

// The projector's home screen: both join codes, with live player lists.
export default function Lobby() {
  const [game, setGame] = useState(null);

  useEffect(() => {
    const join = () => socket.emit("displayJoin");
    if (socket.connected) join();
    socket.on("connect", join);
    socket.on("lobby", setGame);
    return () => {
      socket.off("connect", join);
      socket.off("lobby", setGame);
    };
  }, []);

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
