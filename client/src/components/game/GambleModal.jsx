import Button from "../ui/Button.jsx";

// Pass onChoose to make it tappable (phones/host). Leave it off for the projector.
export default function GambleModal({ gamble, onChoose }) {
  const odds = Math.round(gamble.winChance * 100);
  return (
    <section className="deed gamble">
      <header className="deed-strip strip-green">House offer!</header>
      <div className="deed-body">
        <div className="gamble-options">
          <div className="gamble-option">
            <h3>Play it safe</h3>
            <p>Take <strong>${gamble.safeAmount}</strong> and move {gamble.moveSteps} spaces.</p>
            {onChoose && <Button onClick={() => onChoose("take")}>Take ${gamble.safeAmount}</Button>}
          </div>
          <div className="gamble-option">
            <h3>Double it</h3>
            <p>
              <strong>${gamble.doubleAmount}</strong> and move {gamble.moveSteps} spaces, with a {odds}% chance.
              If it fails you stay put and lose ${gamble.loss}.
            </p>
            {onChoose && (
              <Button variant="cream" onClick={() => onChoose("double")}>
                Double it
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}