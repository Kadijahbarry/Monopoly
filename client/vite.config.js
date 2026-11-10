import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev, forward socket traffic to the Node server on port 3001.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // lets phones on your Wi-Fi reach the dev site
    proxy: {
      "/socket.io": { target: "http://localhost:3001", ws: true },
    },
  },
});