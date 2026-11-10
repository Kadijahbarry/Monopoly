function gambleText(g) {
  if (g.choice === "take") return `Took the safe $${g.cashDelta} and moved ${g.steps} more spaces.`;
  if (g.won) return `Doubled it! +$${g.cashDelta} and moved ${g.steps} more spaces.`;
  return `The gamble failed. -$${Math.abs(g.cashDelta)} and stuck on the same space.`;
}

export default function ResultBanner({ result, teams }) {
  const team = teams[result.team];
  return (
    <section className="deed result">
      <header className={`deed-strip ${result.success ? "strip-green" : "strip-fail"}`}>
        {result.success ? "Correct! Moving forward" : "Not enough correct answers"}
      </header>
      <div className="deed-body">
        <p className="result-line">
          {result.correctCount} of {result.eligibleCount} players correct ({result.percent}%, needed {result.needed}%)
        </p>
        <p className="result-line">
          Correct answer: <strong>{result.correctAnswer}</strong>
        </p>
        {result.success && (
          <p className="result-line">
            {team.name} earns <strong>${result.payout}</strong> and moves {result.roll} spaces.
          </p>
        )}
        {result.gambleResult && <p className="result-line">{gambleText(result.gambleResult)}</p>}
      </div>
    </section>
  );
}