// gameState.js
const state = {
  currentTeam: "red", // "red" or "blue"
};

function nextTurn(io) {
  state.currentTeam = state.currentTeam === "red" ? "blue" : "red";
  io.emit("turnChanged", state.currentTeam);
}
