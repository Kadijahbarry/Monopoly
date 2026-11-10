import { state, publicState } from "../game/gameState.js";
import { CONFIG } from "../game/config.js";
import { findTeamByCode, addOrRejoinPlayer, markDisconnected } from "../game/teamManager.js";
import * as flow from "../game/gameFlow.js";

export function registerSocketHandlers(io) {
  // Three audiences, three levels of detail.
  const broadcast = () => {
    io.to("display").emit("state", publicState({ includeCodes: true }));
    io.to("host").emit("state", publicState({ includeCodes: true, includeAnswer: true }));
    io.to("players").emit("state", publicState());
  };
  flow.setOnChange(broadcast);

  io.on("connection", (socket) => {
    const respond = (ack) => (typeof ack === "function" ? ack : () => {});

    // ---------- Projector ----------
    socket.on("displayJoin", () => {
      socket.join("display");
      socket.emit("state", publicState({ includeCodes: true }));
    });

    // ---------- Host ----------
    socket.on("hostJoin", (pin, ack) => {
      const reply = respond(ack);
      if (String(pin) !== CONFIG.HOST_PIN) return reply({ ok: false, error: "Wrong PIN." });
      socket.data.isHost = true;
      socket.join("host");
      socket.emit("state", publicState({ includeCodes: true, includeAnswer: true }));
      reply({ ok: true });
    });

    const hostAction = (event, fn) =>
      socket.on(event, (payload, ack) => {
        const reply = respond(ack);
        if (!socket.data.isHost) return reply({ ok: false, error: "Not signed in as host." });
        reply(fn(payload || {}));
      });

    hostAction("host:start", () => flow.startGame());
    hostAction("host:roll", (p) => flow.submitRoll(p.roll));
    hostAction("host:closeQuestion", () => flow.closeQuestion());
    hostAction("host:gamble", (p) => flow.submitGamble(p.choice));
    hostAction("host:next", () => flow.nextTurn());
    hostAction("host:end", () => flow.endGame());
    hostAction("host:reset", () => flow.resetGame());

    // ---------- Players ----------
    socket.on("join", (payload, ack) => {
      const reply = respond(ack);
      const team = findTeamByCode(payload?.code);
      if (!team) {
        return reply({ ok: false, error: "That code doesn't match a team. Check the screen and try again." });
      }
      const name = String(payload?.name || "").trim().slice(0, 20);
      const playerId = String(payload?.playerId || "").slice(0, 64);
      if (!name) return reply({ ok: false, error: "Enter a name to join." });
      if (!playerId) return reply({ ok: false, error: "Something went wrong. Refresh and try again." });

      const player = addOrRejoinPlayer(team, { playerId, name, socketId: socket.id });
      socket.data.playerId = playerId;
      socket.data.teamId = team.id;
      socket.join("players");
      socket.join(`team:${team.id}`);

      reply({
        ok: true,
        team: { id: team.id, name: team.name },
        player: { id: player.id, name: player.name },
        state: publicState(),
      });
      broadcast();
    });

    socket.on("answer", (payload, ack) => {
      const reply = respond(ack);
      if (!socket.data.playerId) return reply({ ok: false, error: "Join a team first." });
      reply(flow.submitAnswer(socket.data.playerId, payload?.choice));
    });

    socket.on("gambleChoice", (payload, ack) => {
      const reply = respond(ack);
      if (socket.data.teamId !== state.currentTeam) {
        return reply({ ok: false, error: "It's not your team's offer." });
      }
      reply(flow.submitGamble(payload?.choice));
    });

    socket.on("disconnect", () => {
      if (markDisconnected(socket.id)) broadcast();
    });
  });
}