export default function AnswerButton({ index, letter, text, onClick, selected, dimmed, correct }) {
  const cls = [
    "answer",
    `answer-${"abcd"[index]}`,
    selected ? "selected" : "",
    dimmed ? "dimmed" : "",
    correct ? "is-correct" : "",
  ].join(" ");

  const content = (
    <>
      <span className="answer-letter">{letter}</span>
      <span>{text}</span>
    </>
  );

  if (!onClick) return <div className={cls}>{content}</div>;
  return (
    <button type="button" className={cls} onClick={onClick}>
      {content}
    </button>
  );

}
