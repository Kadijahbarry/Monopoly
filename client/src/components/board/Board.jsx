import { BOARD_SPACES } from "../../data/boardSpaces";
import Space from "./Space.jsx";
import Token from "./Token.jsx";

// `children` is whatever shows in the middle of the board (question, results, etc.).
export default function Board({ game, children }) {
  return (
    <div className="board">
      {BOARD_SPACES.map((space, i) => (
        <Space key={i} space={space} index={i} isHouse={game.houseSpaces.includes(i)} />
      ))}
      <div className="board-center">{children}</div>
      {Object.values(game.teams).map((t) => (
        <Token key={t.id} team={t} boardSize={game.boardSize} />
      ))}
    </div>
  );
}