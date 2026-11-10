import { state, resetState } from "./gameState.js";
import { CONFIG } from "./config.js";
import { eligiblePlayers } from "./teamManager.js";
import { nextQuestion } from "./questionManager.js";
import { evaluateQuestion } from "./scoring.js";
import { movePosition, isHouse } from "./boardLogic.js";
import { resolveGamble } from "./gambleLogic.js";

let onChange = () => {};
let timer = null;

export function setOnChange(fn) {
  onChange = fn;
}

const ok = () => ({ ok: true });
const fail = (error, extra = {}) => ({ ok: false, error, ...extra });

function clearTimer() {
  if (timer) clearTimeout(timer);
  timer = null;
}

export function startGame() {
  if (state.phase !== "lobby") return fail("The game already started.");
  const counts = Object.values(state.teams).map((t) => eligiblePlayers(t).length);
  if (counts.some((c) => c === 0)) return fail("Both teams need at least one player before starting.");
  state.turnNumber = 1;
  state.currentTeam = "red";
  state.phase = "awaitingRoll";
  onChange();
  return ok();
}

export function submitRoll(roll) {
  if (state.phase !== "awaitingRoll") return fail("Not waiting for a dice roll.");
  const n = Number(roll);
  if (!Number.isInteger(n) || n < 1 || n > 12) return fail("Roll must be a whole number from 1 to 12.");

  const team = state.teams[state.currentTeam];
  const eligibleIds = eligiblePlayers(team).map((p) => p.id);
  if (!eligibleIds.length) return fail(`${team.name} has no players connected.`);

  const durationMs = CONFIG.QUESTION_SECONDS * 1000;
  const startedAt = Date.now();
  state.roll = n;
  state.result = null;
  state.question = {
    data: nextQuestion(),
    startedAt,
    endsAt: startedAt + durationMs,
    eligibleIds, // snapshot: only these players count toward the 75%
    answers: {},
  };
  state.phase = "question";

  clearTimer();
  timer = setTimeout(closeQuestion, durationMs + 300);
  onChange();
  return ok();
}

export function submitAnswer(playerId, choice) {
  const q = state.question;
  if (state.phase !== "question" || !q) return fail("No question is active right now.");
  if (!q.eligibleIds.includes(playerId)) {
    return fail("This question isn't for you. If you just joined, you're in for the next one!");
  }
  if (q.answers[playerId]) return fail("You already answered.", { alreadyAnswered: true });

  const c = Number(choice);
  if (!Number.isInteger(c) || c < 0 || c > 3) return fail("Pick one of the four answers.");

  const now = Date.now();
  if (now > q.endsAt + 500) return fail("Time's up.");

  q.answers[playerId] = { choice: c, ms: Math.max(0, now - q.startedAt) };

  // Everyone eligible has answered: no need to wait for the clock.
  if (Object.keys(q.answers).length >= q.eligibleIds.length) closeQuestion();
  else onChange();
  return ok();
}

export function closeQuestion() {
  const q = state.question;
  if (state.phase !== "question" || !q) return fail("No question is active.");
  clearTimer();

  const team = state.teams[state.currentTeam];
  const ev = evaluateQuestion({
    eligibleIds: q.eligibleIds,
    answers: q.answers,
    correctIndex: q.data.correct,
  });

  const from = team.position;
  let to = from;
  if (ev.success) {
    to = movePosition(from, state.roll);
    team.position = to;
    team.cash += ev.payout;
  }

  state.result = {
    turn: state.turnNumber,
    team: team.id,
    success: ev.success,
    correctCount: ev.correctCount,
    eligibleCount: ev.eligibleCount,
    percent: Math.round(ev.percent * 100),
    needed: Math.round(CONFIG.PASS_PERCENT * 100),
    payout: ev.payout,
    avgSeconds: ev.avgSeconds,
    roll: state.roll,
    from,
    to,
    question: q.data.question,
    correctAnswer: q.data.answers[q.data.correct],
    gambleResult: null,
  };
  state.question = null;

  if (ev.success && isHouse(to)) {
    const g = CONFIG.GAMBLE;
    state.gamble = {
      safeAmount: g.SAFE_AMOUNT,
      doubleAmount: g.SAFE_AMOUNT * 2,
      loss: g.LOSS,
      moveSteps: g.MOVE_STEPS,
      winChance: g.DOUBLE_WIN_CHANCE,
    };
    state.phase = "gamble";
  } else {
    state.phase = "results";
  }

  onChange();
  return ok();
}

export function submitGamble(choice) {
  if (state.phase !== "gamble") return fail("There's no house offer right now.");
  if (choice !== "take" && choice !== "double") return fail("Choose take or double.");

  const team = state.teams[state.currentTeam];
  const out = resolveGamble(choice);
  team.cash = Math.max(0, team.cash + out.cashDelta);
  if (out.steps) team.position = movePosition(team.position, out.steps);

  state.result.gambleResult = {
    choice: out.choice,
    won: out.won,
    cashDelta: out.cashDelta,
    steps: out.steps,
    to: team.position,
  };
  state.gamble = null;
  state.phase = "results";
  onChange();
  return ok();
}

export function nextTurn() {
  if (state.phase !== "results" && state.phase !== "awaitingRoll") {
    return fail("Finish the current step first.");
  }
  if (state.turnNumber >= CONFIG.TOTAL_TURNS) return endGame();

  state.turnNumber += 1;
  state.currentTeam = state.currentTeam === "red" ? "blue" : "red";
  state.roll = null;
  state.result = null;
  state.phase = "awaitingRoll";
  onChange();
  return ok();
}

export function endGame() {
  clearTimer();
  const { red, blue } = state.teams;
  state.winner = red.cash > blue.cash ? "red" : blue.cash > red.cash ? "blue" : "tie";
  state.question = null;
  state.gamble = null;
  state.phase = "finished";
  onChange();
  return ok();
}

export function resetGame() {
  clearTimer();
  resetState();
  onChange();
  return ok();
}