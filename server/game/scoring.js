import { CONFIG } from "./config.js";

// 1.0 at/under FULL_PAYOUT_SECONDS, shrinking in a straight line to MIN_PAYOUT_FACTOR at the time limit.
export function timeFactor(avgSeconds) {
  const full = CONFIG.FULL_PAYOUT_SECONDS;
  const max = CONFIG.QUESTION_SECONDS;
  const min = CONFIG.MIN_PAYOUT_FACTOR;
  if (avgSeconds <= full) return 1;
  if (avgSeconds >= max) return min;
  const t = (avgSeconds - full) / (max - full);
  return 1 - t * (1 - min);
}

// eligibleIds: players who were connected when the question started.
// answers: { [playerId]: { choice, ms } }. Players who didn't answer count as wrong.
export function evaluateQuestion({ eligibleIds, answers, correctIndex }) {
  const eligibleCount = eligibleIds.length;
  let correctCount = 0;
  let totalMs = 0;

  for (const id of eligibleIds) {
    const a = answers[id];
    if (a && a.choice === correctIndex) {
      correctCount++;
      totalMs += a.ms;
    }
  }

  const percent = eligibleCount ? correctCount / eligibleCount : 0;
  const success = eligibleCount > 0 && percent >= CONFIG.PASS_PERCENT;
  const avgSeconds = correctCount ? totalMs / correctCount / 1000 : null;
  const payout = success
    ? Math.round((CONFIG.BASE_PAYOUT * timeFactor(avgSeconds)) / 10) * 10
    : 0;

  return { eligibleCount, correctCount, percent, success, avgSeconds, payout };
}