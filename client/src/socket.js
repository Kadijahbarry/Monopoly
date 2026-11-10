import { io } from "socket.io-client";

// One shared connection for the whole app.
const socket = io();
export default socket;
