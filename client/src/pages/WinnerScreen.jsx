import { useMemo } from "react";

const COLORS = ["--team-red", "--team-blue", "--monopoly-green", "--c-yellow", "--c-orange"];

export default function WinnerScreen({ game }) {
  const tie = game.winner === "tie";
  const winner = game.teams[game.winner];

  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 4 + Math.random() * 4,
        color: COLORS[i % COLORS.length],
      })),
    []
  );

  return (
    <main className={`winner ${tie ? "" : `turn-${game.winner}`}`}>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            background: `var(${p.color})`,
          }}
        />
      ))}
      <h1 className="title">{tie ? "It's a tie!" : `${winner.name} wins!`}</h1>
      <div className="deeds final-scores">
        {Object.values(game.teams).map((t) => (
          <section key={t.id} className="deed">
            <header className={`deed-strip strip-${t.id}`}>{t.name}</header>
            <div className="deed-body">
              <p className="deed-code">${t.cash}</p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}