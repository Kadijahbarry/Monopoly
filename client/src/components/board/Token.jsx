import { useEffect, useState } from "react";
import { gridPosition } from "../../data/boardSpaces";

// Walks the token one space at a time toward its target, so moves look like a real piece moving.
export default function Token({ team, boardSize }) {
  const [shown, setShown] = useState(team.position);

  useEffect(() => {
    if (shown === team.position) return;
    const id = setTimeout(() => setShown((s) => (s + 1) % boardSize), 220);
    return () => clearTimeout(id);
  }, [shown, team.position, boardSize]);

  const { row, col } = gridPosition(shown);
  const offset = team.id === "red" ? -20 : 20; // keeps both tokens visible on the same space
  const style = {
    left: `${((col - 0.5) / 11) * 100 + offset / 11}%`,
    top: `${((row - 0.5) / 11) * 100}%`,
  };

  return <div className={`token token-${team.id}`} style={style} title={team.name} />;
}