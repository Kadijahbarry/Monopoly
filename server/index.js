import express from "express";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./sockets/socketHandlers.js";
import { state } from "./game/gameState.js";
import { questionCount } from "./game/questionManager.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: true } });

app.get("/health", (_req, res) => res.send("ok"));

// In production, serve the built React app from the same server.
const dist = path.join(__dirname, "../client/dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

registerSocketHandlers(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Team Red code:  ${state.teams.red.code}`);
  console.log(`Team Blue code: ${state.teams.blue.code}`);
  if (questionCount < 40) console.warn(`Only ${questionCount} questions loaded (you need 40).`);
});


