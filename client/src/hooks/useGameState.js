import { useEffect, useRef, useState } from "react";
import socket from "../socket";

// Subscribes to the server's "state" broadcasts.
// `join` runs on first load and every time the connection comes back (e.g. phone wakes up).
export default function useGameState(join) {
  const [game, setGame] = useState(null);
  const [receivedAt, setReceivedAt] = useState(Date.now());
  const joinRef = useRef(join);
  joinRef.current = join;

  useEffect(() => {
    const hello = () => joinRef.current && joinRef.current();
    const onState = (s) => {
      setGame(s);
      setReceivedAt(Date.now());
    };
    if (socket.connected) hello();
    socket.on("connect", hello);
    socket.on("state", onState);
    return () => {
      socket.off("connect", hello);
      socket.off("state", onState);
    };
  }, []);

  return { game, receivedAt };
}
