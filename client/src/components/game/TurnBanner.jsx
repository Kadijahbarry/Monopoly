export default function TurnBanner({ game }) {
  const team = game.teams[game.currentTeam];
  return (
    <div className={`turn-banner strip-${team.id}`}>
      {team.name}'s turn
      <span className="turn-count">Turn {game.turnNumber} of {game.totalTurns}</span>
    </div>
  );
}