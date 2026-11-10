export const CONFIG = {
  BOARD_SIZE: 40,
  STARTING_CASH: 500,
  TOTAL_TURNS: 20, // both teams combined (10 each)

  QUESTION_SECONDS: 30,
  PASS_PERCENT: 0.75,
  BASE_PAYOUT: 200,
  FULL_PAYOUT_SECONDS: 5, // answer this fast or faster = full payout
  MIN_PAYOUT_FACTOR: 0.25, // payout never drops below 25%

  GAMBLE: {
    SAFE_AMOUNT: 250,
    MOVE_STEPS: 3,
    LOSS: 100,
    DOUBLE_WIN_CHANCE: 0.5,
  },

  // Board indexes (0 = GO) that trigger the house offer.
  HOUSE_SPACES: [3, 6, 9, 13, 16, 19, 24, 27, 32, 37],

  HOST_PIN: process.env.HOST_PIN || "monopoly",
};