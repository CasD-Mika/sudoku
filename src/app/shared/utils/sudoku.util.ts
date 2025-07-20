import Sudoku from "../classes/sudoku.class";
import { GridInterface } from "../interfaces/grid.interface";
import { NewboardInterface } from "../interfaces/newboard.interface";
import { SudokuInterface } from "../interfaces/sudoku.interface";
import { DifficultyType } from "../types/difficulty.type";

const getSolution = (grid: number[][]) => {
  const nsudoku = new Sudoku();
  nsudoku.setBoard(grid);
  const solgrid = nsudoku.solve();
  return solgrid;
}

const genBoard = (targetDifficulty: DifficultyType = 'Medium') => {
  const sudoku = new Sudoku({ mode: "9" });
  sudoku.generate(targetDifficulty);
  const grid = sudoku.grid;
  return {
    value: grid,
    default: structuredClone(grid),
    solution: getSolution(structuredClone(grid)),
    difficulty: sudoku.getDifficulty(),
  } as GridInterface;
}

const genBoardWithDifficulty = (targetDifficulty: DifficultyType = 'Medium'): GridInterface => {
  const maxTries = 100;
  for (let i = 0; i < maxTries; i++) {
    const board = genBoard(targetDifficulty);
    if (!targetDifficulty || board.difficulty.toLowerCase() === targetDifficulty.toLowerCase()) {
      return board;
    }
  }
  throw new Error(`Could not generate a board with difficulty "${targetDifficulty}" after ${maxTries} tries.`);
};

const getNewboard = (difficulty: DifficultyType = 'Medium'): NewboardInterface => {
  try {
    const board = genBoardWithDifficulty(difficulty);

    return {
      grid: board,
      message: "All Ok"
    };
  } catch (e) {
    return {
      message: (e as Error).toString(),
      grid: null
    };
  }
}

export const getSudoku = (difficulty: DifficultyType = 'Medium'): SudokuInterface => {
  return {
    newboard: getNewboard(difficulty)
  } as SudokuInterface;
}
