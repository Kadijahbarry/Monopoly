export default function Scoreboard({ game }) {
  return (
    <aside className="scoreboard">
      {Object.values(game.teams).map((t) => (
        <section key={t.id} className={`deed score-card ${game.currentTeam === t.id ? "active" : ""}`}>
          <header className={`deed-strip strip-${t.id}`}>{t.name}</header>
          <div className="deed-body">
            <p className="score-cash">${t.cash}</p>
            <p className="deed-count">
              {t.playerCount} {t.playerCount === 1 ? "player" : "players"}
            </p>
          </div>
        </section>
      ))}
    </aside>
  );
}