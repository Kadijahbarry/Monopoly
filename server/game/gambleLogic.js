import { CONFIG } from "./config.js";

export function resolveGamble(choice, rng = Math.random) {
  const g = CONFIG.GAMBLE;

  if (choice === "take") {
    return { choice, won: true, cashDelta: g.SAFE_AMOUNT, steps: g.MOVE_STEPS };
  }

  // "double": risk it
  const won = rng() < g.DOUBLE_WIN_CHANCE;
  return won
    ? { choice, won: true, cashDelta: g.SAFE_AMOUNT * 2, steps: g.MOVE_STEPS }
    : { choice, won: false, cashDelta: -g.LOSS, steps: 0 };
}