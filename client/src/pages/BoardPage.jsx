import { useEffect, useState } from "react";
import socket from "../socket";
import Board from "../components/board/Board";

export default function BoardPage() {
  const [currentTeam, setCurrentTeam] = useState("red");

  useEffect(() => {
    socket.on("turnChanged", setCurrentTeam);
    return () => socket.off("turnChanged", setCurrentTeam);
  }, []);

  return (
    <div className={`board-page turn-${currentTeam}`}>
      <Board />
    </div>
  );
}
