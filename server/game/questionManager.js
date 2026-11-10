import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const all = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/questions.json"), "utf8"));

let queue = [];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Never repeats a question until all of them have been used.
export function nextQuestion() {
  if (queue.length === 0) queue = shuffle([...all]);
  return queue.pop();
}

// Strip the answer before sending to phones.
export function questionForPlayers(q) {
  const { correct, ...safe } = q;
  return safe;
}

export const questionCount = all.length;