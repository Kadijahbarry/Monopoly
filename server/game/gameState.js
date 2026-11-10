export const STARTING_CASH = 500;

function makeCode(prefix) {
  return prefix + Math.floor(100 + Math.random() * 900);
}

function makeTeam(id, name, code) {
  return { id, name, code, cash: STARTING_CASH, position: 0, players: {} };
}

// The single source of truth for the whole game.
export const state = {
  phase: "lobby", // later: "question" | "gamble" | "results" | "finished"
  currentTeam: "red",
  teams: {
    red: makeTeam("red", "Team Red", (process.env.RED_CODE || makeCode("RED")).toUpperCase()),
    blue: makeTeam("blue", "Team Blue", (process.env.BLUE_CODE || makeCode("BLU")).toUpperCase()),
  },
};

// What clients are allowed to see. Codes only go to the projector.
export function publicState({ includeCodes = false } = {}) {
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
  return { phase: state.phase, currentTeam: state.currentTeam, teams };
}