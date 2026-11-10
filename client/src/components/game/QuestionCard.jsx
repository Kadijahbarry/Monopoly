import AnswerButton from "./AnswerButton.jsx";

const LETTERS = ["A", "B", "C", "D"];

// Looks like a property deed: team-colored strip with the question, answers as "rent lines".
// Pass onAnswer to make it tappable (phones). Leave it off for the projector.
export default function QuestionCard({ question, teamId, onAnswer, picked = null, correctIndex = null }) {
  const locked = picked !== null;
  return (
    <section className="deed qcard">
      <header className={`deed-strip strip-${teamId} qcard-q`}>{question.question}</header>
      <div className="answers">
        {question.answers.map((text, i) => (
          <AnswerButton
            key={i}
            index={i}
            letter={LETTERS[i]}
            text={text}
            onClick={onAnswer && !locked ? () => onAnswer(i) : undefined}
            selected={picked === i}
            dimmed={locked && picked !== i}
            correct={correctIndex === i}
          />
        ))}
      </div>
    </section>
  );
}