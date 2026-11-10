import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import useGameState from "../hooks/useGameState";
import Board from "../components/board/Board.jsx";
import Scoreboard from "../components/game/Scoreboard.jsx";
import TurnBanner from "../components/game/TurnBanner.jsx";
import QuestionCard from "../components/game/QuestionCard.jsx";
import Timer from "../components/game/Timer.jsx";
import GambleModal from "../components/game/GambleModal.jsx";
import ResultBanner from "../components/game/ResultBanner.jsx";
import AudioManager from "../components/audio/AudioManager.jsx";
import WinnerScreen from "./WinnerScreen.jsx";

// Whatever belongs in the middle of the board right now.
function Stage({ game, receivedAt }) {
  const team = game.teams[game.currentTeam];
  const q = game.question;

  return (
    <div className="stage">
      <TurnBanner game={game} />

      {game.phase === "awaitingRoll" && (
        <p className="stage-text">Roll the dice! Waiting for the host to enter the roll.</p>
      )}

      {game.phase === "question" && q && (
        <>
          <p className="stage-text">
            Rolled a <strong>{game.roll}</strong>. Answer correctly to move!
          </p>
          <Timer question={q} receivedAt={receivedAt} config={game.config} />
          <QuestionCard question={q} teamId={team.id} />
          <p className="stage-text">
            {q.answeredCount} of {q.eligibleCount} answered
          </p>
        </>
      )}

      {game.phase === "gamble" && (
        <>
          <p className="stage-text">{team.name} passed the trivia and landed on a house!</p>
          <GambleModal gamble={game.gamble} />
        </>
      )}

      {game.phase === "results" && game.result && (
        <ResultBanner result={game.result} teams={game.teams} />
      )}
    </div>
  );
}

export default function BoardPage() {
  const navigate = useNavigate();
  const { game, receivedAt } = useGameState(() => socket.emit("displayJoin"));

  useEffect(() => {
    if (game?.phase === "lobby") navigate("/");
  }, [game, navigate]);

  if (!game) return <main className="board-page">Connecting...</main>;
  if (game.phase === "finished") return <WinnerScreen game={game} />;
  if (game.phase === "lobby") return null;

  return (
    <div className={`board-page turn-${game.currentTeam}`}>
      <AudioManager game={game} />
      <Scoreboard game={game} />
      <Board game={game}>
        <Stage game={game} receivedAt={receivedAt} />
      </Board>
    </div>
  );
}