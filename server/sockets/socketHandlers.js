import { publicState } from "../game/gameState.js";
import { findTeamByCode, addOrRejoinPlayer, markDisconnected } from "../game/teamManager.js";

export function registerSocketHandlers(io) {
  // Projector gets codes; phones get the safe version.
  const broadcast = () => {
    io.to("display").emit("lobby", publicState({ includeCodes: true }));
    io.to("players").emit("state", publicState());
  };

  io.on("connection", (socket) => {
    socket.on("displayJoin", () => {
      socket.join("display");
      socket.emit("lobby", publicState({ includeCodes: true }));
    });

    socket.on("join", (payload, ack) => {
      const reply = typeof ack === "function" ? ack : () => {};
      const team = findTeamByCode(payload?.code);
      if (!team) {
        return reply({ ok: false, error: "That code doesn't match a team. Check the screen and try again." });
      }
      const name = String(payload?.name || "").trim().slice(0, 20);
      const playerId = String(payload?.playerId || "").slice(0, 64);
      if (!name) return reply({ ok: false, error: "Enter a name to join." });
      if (!playerId) return reply({ ok: false, error: "Something went wrong. Refresh and try again." });

      const player = addOrRejoinPlayer(team, { playerId, name, socketId: socket.id });
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

    socket.on("disconnect", () => {
      if (markDisconnected(socket.id)) broadcast();
    });
  });
}
