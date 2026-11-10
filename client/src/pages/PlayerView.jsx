import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import useGameState from "../hooks/useGameState";
import Button from "../components/ui/Button.jsx";
import QuestionCard from "../components/game/QuestionCard.jsx";
import Timer from "../components/game/Timer.jsx";
import GambleModal from "../components/game/GambleModal.jsx";
import ResultBanner from "../components/game/ResultBanner.jsx";
import { getPlayerId, loadSession, clearSession } from "../session";

export default function PlayerView() {
  const navigate = useNavigate();
  const session = loadSession();
  const [picked, setPicked] = useState(null); // -1 means "locked, but no answer registered"
  const [note, setNote] = useState("");

  // Runs on first load AND every time the connection comes back.
  const { game, receivedAt } = useGameState(() => {
    const s = loadSession();
    if (!s) return navigate("/play", { replace: true });
    socket.emit("join", { code: s.code, name: s.name, playerId: getPlayerId() }, (res) => {
      if (!res?.ok) {
        clearSession();
        navigate("/play", { replace: true });
      }
    });
  });

  // New turn = fresh answer state.
  const turn = game?.turnNumber;
  useEffect(() => {
    setPicked(null);
    setNote("");
  }, [turn]);

  if (!session) return null;
  const teamId = session.team.id;
  const me = game?.teams[teamId];
  const myTurn = game && game.currentTeam === teamId;
  const otherName = game ? game.teams[game.currentTeam].name : "";

  function answer(i) {
    setPicked(i);
    socket.emit("answer", { choice: i }, (res) => {
      if (!res?.ok) {
        setPicked(-1);
        setNote(res?.error || "Couldn't send your answer.");
      }
    });
  }

  function choose(choice) {
    socket.emit("gambleChoice", { choice }, (res) => {
      if (!res?.ok) setNote(res?.error || "");
    });
  }

  function leave() {
    clearSession();
    navigate("/play");
  }

  let status = "Connecting...";
  if (game) {
    switch (game.phase) {
      case "lobby":
        status = "Waiting for the host to start the game.";
        break;
      case "awaitingRoll":
        status = myTurn ? "Your team is up! The host is rolling the dice." : `${otherName} is rolling. You're up next.`;
        break;
      case "question":
        status = myTurn
          ? picked === null
            ? "Tap your answer!"
            : note || "Answer locked in! Waiting for your teammates."
          : `${otherName} is answering. Stay quiet!`;
        break;
      case "gamble":
        status = myTurn ? "You landed on a house! Choose together." : `${otherName} landed on a house.`;
        break;
      case "results":
        status = "Waiting for the next turn.";
        break;
      case "finished":
        status = game.winner === "tie" ? "It's a tie!" : `${game.teams[game.winner].name} wins!`;
        break;
      default:
        break;
    }
  }

  return (
    <main className={`player team-${teamId}`}>
      <section className="deed join-card">
        <header className={`deed-strip strip-${teamId}`}>{session.team.name}</header>
        <div className="deed-body">
          <p className="deed-label">
            {session.name}
            {me ? ` · $${me.cash}` : ""}
          </p>
          <p className="waiting">{status}</p>
          {game?.phase === "lobby" && (
            <Button variant="cream" onClick={leave}>Switch team</Button>
          )}
        </div>
      </section>

      {game?.phase === "question" && myTurn && game.question && (
        <div className="join-card">
          <Timer question={game.question} receivedAt={receivedAt} config={game.config} />
          <QuestionCard
            question={game.question}
            teamId={teamId}
            onAnswer={answer}
            picked={picked}
          />
        </div>
      )}

      {game?.phase === "gamble" && myTurn && game.gamble && (
        <div className="join-card">
          <GambleModal gamble={game.gamble} onChoose={choose} />
        </div>
      )}

      {game?.phase === "results" && game.result && (
        <div className="join-card">
          <ResultBanner result={game.result} teams={game.teams} />
        </div>
      )}
    </main>
  );
}