import { CONFIG } from "./config.js";

function makeCode(prefix) {
  return prefix + Math.floor(100 + Math.random() * 900);
}

function makeTeam(id, name, code) {
  return { id, name, code, cash: CONFIG.STARTING_CASH, position: 0, players: {} };
}

// The single source of truth for the whole game.
export const state = {
  phase: "lobby", // lobby | awaitingRoll | question | gamble | results | finished
  currentTeam: "red",
  turnNumber: 0,
  roll: null,
  question: null, // internal: includes the correct answer, never sent as-is
  result: null,
  gamble: null,
  winner: null,
  teams: {
    red: makeTeam("red", "Team Red", (process.env.RED_CODE || makeCode("RED")).toUpperCase()),
    blue: makeTeam("blue", "Team Blue", (process.env.BLUE_CODE || makeCode("BLU")).toUpperCase()),
  },
};

export function resetState() {
  state.phase = "lobby";
  state.currentTeam = "red";
  state.turnNumber = 0;
  state.roll = null;
  state.question = null;
  state.result = null;
  state.gamble = null;
  state.winner = null;
  for (const t of Object.values(state.teams)) {
    t.cash = CONFIG.STARTING_CASH;
    t.position = 0;
  }
}

// What clients are allowed to see.
// Codes only go to the projector/host. The correct answer only goes to the host.
export function publicState({ includeCodes = false, includeAnswer = false } = {}) {
  const teams = {};
  for (const t of Object.values(state.teams)) {
    const players = Object.values(t.players)
      .filter((p) => p.connected)
      .map((p) => ({ id: p.id, name: p.name }));
    teams[t.id] = {
      id: t.id,
      name: t.name,
      cash: t.cash,
      position: t.position,
      playerCount: players.length,
      players,
      ...(includeCodes ? { code: t.code } : {}),
    };
  }

  const q = state.question;
  const question = q
    ? {
        id: q.data.id,
        question: q.data.question,
        answers: q.data.answers,
        durationMs: CONFIG.QUESTION_SECONDS * 1000,
        endsInMs: Math.max(0, q.endsAt - Date.now()),
        eligibleCount: q.eligibleIds.length,
        answeredCount: Object.keys(q.answers).length,
        ...(includeAnswer ? { correct: q.data.correct } : {}),
      }
    : null;

  return {
    phase: state.phase,
    currentTeam: state.currentTeam,
    turnNumber: state.turnNumber,
    totalTurns: CONFIG.TOTAL_TURNS,
    boardSize: CONFIG.BOARD_SIZE,
    houseSpaces: CONFIG.HOUSE_SPACES,
    roll: state.roll,
    question,
    result: state.result,
    gamble: state.gamble,
    winner: state.winner,
    teams,
    config: {
      questionSeconds: CONFIG.QUESTION_SECONDS,
      basePayout: CONFIG.BASE_PAYOUT,
      fullPayoutSeconds: CONFIG.FULL_PAYOUT_SECONDS,
      minPayoutFactor: CONFIG.MIN_PAYOUT_FACTOR,
      passPercent: CONFIG.PASS_PERCENT,
    },
  };
}