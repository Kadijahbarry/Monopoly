import { gridPosition } from "../../data/boardSpaces";

export default function Space({ space, index, isHouse }) {
  const { row, col } = gridPosition(index);
  return (
    <div
      className={`space space-${space.type || "property"}`}
      style={{ gridRow: row, gridColumn: col }}
    >
      {space.color && <div className="space-strip" style={{ background: `var(--c-${space.color})` }} />}
      <span className="space-name">{space.name}</span>
      {isHouse && <span className="space-house" title="House offer">🏠</span>}
    </div>
  );
}