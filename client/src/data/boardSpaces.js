// Names and colors only. Which spaces are houses comes from the server.
export const BOARD_SPACES = [
  { name: "GO", type: "corner" },
  { name: "Mediterranean Ave", color: "brown" },
  { name: "Community Chest", type: "chest" },
  { name: "Baltic Ave", color: "brown" },
  { name: "Income Tax", type: "tax" },
  { name: "Reading Railroad", type: "rail" },
  { name: "Oriental Ave", color: "lightblue" },
  { name: "Chance", type: "chance" },
  { name: "Vermont Ave", color: "lightblue" },
  { name: "Connecticut Ave", color: "lightblue" },
  { name: "Jail", type: "corner" },
  { name: "St. Charles Place", color: "pink" },
  { name: "Electric Company", type: "utility" },
  { name: "States Ave", color: "pink" },
  { name: "Virginia Ave", color: "pink" },
  { name: "Pennsylvania Railroad", type: "rail" },
  { name: "St. James Place", color: "orange" },
  { name: "Community Chest", type: "chest" },
  { name: "Tennessee Ave", color: "orange" },
  { name: "New York Ave", color: "orange" },
  { name: "Free Parking", type: "corner" },
  { name: "Kentucky Ave", color: "red" },
  { name: "Chance", type: "chance" },
  { name: "Indiana Ave", color: "red" },
  { name: "Illinois Ave", color: "red" },
  { name: "B&O Railroad", type: "rail" },
  { name: "Atlantic Ave", color: "yellow" },
  { name: "Ventnor Ave", color: "yellow" },
  { name: "Water Works", type: "utility" },
  { name: "Marvin Gardens", color: "yellow" },
  { name: "Go To Jail", type: "corner" },
  { name: "Pacific Ave", color: "green" },
  { name: "North Carolina Ave", color: "green" },
  { name: "Community Chest", type: "chest" },
  { name: "Pennsylvania Ave", color: "green" },
  { name: "Short Line", type: "rail" },
  { name: "Chance", type: "chance" },
  { name: "Park Place", color: "blue" },
  { name: "Luxury Tax", type: "tax" },
  { name: "Boardwalk", color: "blue" },
];

// Maps a space index (0 = GO, bottom-right) to a spot on an 11x11 grid, going clockwise.
export function gridPosition(i) {
  if (i <= 10) return { row: 11, col: 11 - i };
  if (i <= 20) return { row: 11 - (i - 10), col: 1 };
  if (i <= 30) return { row: 1, col: 1 + (i - 20) };
  return { row: 1 + (i - 30), col: 11 };
}
