import { state } from "./gameState.js";

export function findTeamByCode(code) {
  const c = String(code || "").trim().toUpperCase();
  return Object.values(state.teams).find((t) => t.code === c) || null;
}

// Works for brand-new players AND for phones that refresh or reconnect.
// Teams never lock, so people can join at any point in the event.
export function addOrRejoinPlayer(team, { playerId, name, socketId }) {
  for (const t of Object.values(state.teams)) {
    if (t.id !== team.id && t.players[playerId]) delete t.players[playerId];
  }
  const existing = team.players[playerId];
  team.players[playerId] = {
    id: playerId,
    name: name || existing?.name || "Player",
    socketId,
    connected: true,
    joinedAt: existing?.joinedAt ?? Date.now(),
  };
  return team.players[playerId];
}

export function markDisconnected(socketId) {
  let changed = false;
  for (const t of Object.values(state.teams)) {
    for (const p of Object.values(t.players)) {
      if (p.socketId === socketId && p.connected) {
        p.connected = false;
        changed = true;
      }
    }
  }
  return changed;
}

// Used by the 75% rule later: only players connected when a question starts count.
export function eligiblePlayers(team) {
  return Object.values(team.players).filter((p) => p.connected);
}
