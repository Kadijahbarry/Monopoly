import { useEffect, useRef, useState } from "react";
import Button from "../ui/Button.jsx";

// Tense loop while a question is live. Correct/wrong sting when it's resolved.
// Browsers block sound until someone clicks, so the projector gets one "Enable sound" button.
export default function AudioManager({ game }) {
  const [enabled, setEnabled] = useState(false);
  const tense = useRef(null);
  const correct = useRef(null);
  const wrong = useRef(null);
  const lastPlayedTurn = useRef(null);

  useEffect(() => {
    tense.current = new Audio("/audio/tense-loop.mp3");
    tense.current.loop = true;
    correct.current = new Audio("/audio/correct.mp3");
    wrong.current = new Audio("/audio/wrong.mp3");
    return () => tense.current && tense.current.pause();
  }, []);

  useEffect(() => {
    if (!enabled || !tense.current) return;
    if (game.phase === "question") {
      tense.current.currentTime = 0;
      tense.current.play().catch(() => {});
    } else {
      tense.current.pause();
    }
  }, [game.phase, game.turnNumber, enabled]);

  useEffect(() => {
    if (!enabled) return;
    const r = game.result;
    if ((game.phase === "results" || game.phase === "gamble") && r && lastPlayedTurn.current !== r.turn) {
      lastPlayedTurn.current = r.turn;
      const sound = r.success ? correct.current : wrong.current;
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
      }
    }
  }, [game.phase, game.result, enabled]);

  if (enabled) return null;
  return (
    <div className="sound-prompt">
      <Button onClick={() => setEnabled(true)}>Enable sound</Button>
    </div>
  );
}