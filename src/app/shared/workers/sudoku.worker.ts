/// <reference lib="webworker" />

import { DifficultyType } from "../types/difficulty.type";
import { getSudoku } from "../utils/sudoku.util";

addEventListener('message', (event) => {
  const difficulty: DifficultyType = event.data.difficulty;

  postMessage(getSudoku(difficulty));
});
