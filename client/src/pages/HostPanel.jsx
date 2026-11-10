import { useState } from "react";
import socket from "../socket";
import useGameState from "../hooks/useGameState";
import Button from "../components/ui/Button.jsx";
import Timer from "../components/game/Timer.jsx";
import QuestionCard from "../components/game/QuestionCard.jsx";
import ResultBanner from "../components/game/ResultBanner.jsx";
import GambleModal from "../components/game/GambleModal.jsx";
import TurnBanner from "../components/game/TurnBanner.jsx";

const PIN_KEY = "monopoly-host-pin";
const DICE = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function HostPanel() {
  const [authed, setAuthed] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState("");

  function login(pin) {
    socket.emit("hostJoin", pin, (res) => {
      if (res?.ok) {
        sessionStorage.setItem(PIN_KEY, pin);
        setAuthed(true);
        setError("");
      } else {
        sessionStorage.removeItem(PIN_KEY);
        setAuthed(false);
        setError(res?.error || "Couldn't sign in.");
      }
    });
  }

  // Re-signs in automatically after a refresh or a dropped connection.
  const { game, receivedAt } = useGameState(() => {
    const saved = sessionStorage.getItem(PIN_KEY);
    if (saved) login(saved);
  });

  function act(event, payload = {}) {
    socket.emit(event, payload, (res) => setError(res?.ok ? "" : res?.error || "Something went wrong."));
  }

  function confirmAct(message, event) {
    if (window.confirm(message)) act(event);
  }

  if (!authed) {
    return (
      <main className="host">
        <h1 className="title title-small">Host panel</h1>
        <form
          className="deed"
          onSubmit={(e) => {
            e.preventDefault();
            login(pinInput);
          }}
        >
          <header className="deed-strip strip-green">Host sign-in</header>
          <div className="deed-body join">
            <label>
              PIN
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoComplete="off"
                required
              />
            </label>
            {error && <p className="error" role="alert">{error}</p>}
            <Button type="submit">Sign in</Button>
          </div>
        </form>
      </main>
    );
  }

  if (!game) return <main className="host"><p>Loading...</p></main>;

  const team = game.teams[game.currentTeam];
  const q = game.question;

  return (
    <main className="host">
      <h1 className="title title-small">Host panel</h1>
      {error && <p className="error" role="alert">{error}</p>}

      {game.phase === "lobby" && (
        <section className="deed">
          <header className="deed-strip strip-green">Waiting to start</header>
          <div className="deed-body">
            {Object.values(game.teams).map((t) => (
              <p key={t.id} className="deed-label">
                {t.name}: <strong>{t.code}</strong> ({t.playerCount} players)
              </p>
            ))}
            <Button onClick={() => act("host:start")}>Start game</Button>
          </div>
        </section>
      )}

      {game.phase !== "lobby" && game.phase !== "finished" && <TurnBanner game={game} />}

      {game.phase === "awaitingRoll" && (
        <section className="deed">
          <header className={`deed-strip strip-${team.id}`}>Enter {team.name}'s dice roll</header>
          <div className="deed-body">
            <div className="dice-grid">
              {DICE.map((n) => (
                <Button key={n} onClick={() => act("host:roll", { roll: n })}>{n}</Button>
              ))}
            </div>
            <Button variant="cream" onClick={() => act("host:next")}>Skip this turn</Button>
          </div>
        </section>
      )}

      {game.phase === "question" && q && (
        <>
          <p className="stage-text">Rolled a {game.roll}. {q.answeredCount} of {q.eligibleCount} answered.</p>
          <Timer question={q} receivedAt={receivedAt} config={game.config} />
          <QuestionCard question={q} teamId={team.id} correctIndex={q.correct} />
          <Button onClick={() => act("host:closeQuestion")}>Close question now</Button>
        </>
      )}

      {game.phase === "gamble" && (
        <>
          <p className="stage-text">{team.name} landed on a house. Their phones can choose, or you can.</p>
          <GambleModal gamble={game.gamble} onChoose={(choice) => act("host:gamble", { choice })} />
        </>
      )}

      {game.phase === "results" && game.result && (
        <>
          <ResultBanner result={game.result} teams={game.teams} />
          <Button onClick={() => act("host:next")}>Next turn</Button>
        </>
      )}

      {game.phase === "finished" && (
        <section className="deed">
          <header className="deed-strip strip-green">Game over</header>
          <div className="deed-body">
            <p className="deed-label">
              {game.winner === "tie" ? "It's a tie!" : `${game.teams[game.winner].name} wins!`}
            </p>
            <Button onClick={() => act("host:reset")}>Back to lobby</Button>
          </div>
        </section>
      )}

      <div className="host-footer">
        {game.phase !== "lobby" && game.phase !== "finished" && (
          <Button variant="cream" onClick={() => confirmAct("End the game now and show the winner?", "host:end")}>
            End game now
          </Button>
        )}
        {game.phase !== "lobby" && (
          <Button variant="cream" onClick={() => confirmAct("Reset scores and go back to the lobby?", "host:reset")}>
            Reset to lobby
          </Button>
        )}
      </div>
    </main>
  );
}