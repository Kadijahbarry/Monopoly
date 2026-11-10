export default function PlayerList({ players }) {
  if (!players.length) return <p className="empty">Waiting for players to join.</p>;
  return (
    <ul className="player-list">
      {players.map((p) => (
        <li key={p.id} className="chip">{p.name}</li>
      ))}
    </ul>
  );
}