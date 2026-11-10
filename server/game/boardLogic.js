import { CONFIG } from "./config.js";

export function movePosition(position, steps) {
  return (position + steps) % CONFIG.BOARD_SIZE;
}

export function isHouse(position) {
  return CONFIG.HOUSE_SPACES.includes(position);
}