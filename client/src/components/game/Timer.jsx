import { useEffect, useState } from "react";

// Same formula as the server (server/game/scoring.js), used only to show the shrinking payout.
function factor(seconds, c) {
  if (seconds <= c.fullPayoutSeconds) return 1;
  if (seconds >= c.questionSeconds) return c.minPayoutFactor;
  const t = (seconds - c.fullPayoutSeconds) / (c.questionSeconds - c.fullPayoutSeconds);
  return 1 - t * (1 - c.minPayoutFactor);
}

export default function Timer({ question, receivedAt, config }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, receivedAt + question.endsInMs - now);
  const elapsed = question.durationMs - remaining;
  const pct = (remaining / question.durationMs) * 100;
  const payout = Math.round((config.basePayout * factor(elapsed / 1000, config)) / 10) * 10;

  return (
    <div className="timer">
      <div className="timer-bar">
        <div className="timer-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="timer-row">
        <span>{Math.ceil(remaining / 1000)}s</span>
        <span>Payout if answered now: ${payout}</span>
      </div>
    </div>
  );
}