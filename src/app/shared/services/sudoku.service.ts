import { Injectable } from '@angular/core';
import { DifficultyType } from '../types/difficulty.type';
import Sudoku from '../classes/sudoku.class';
import { SudokuInterface } from '../interfaces/sudoku.interface';
import { NewboardInterface } from '../interfaces/newboard.interface';
import { GridInterface } from '../interfaces/grid.interface';

@Injectable()
export class SudokuService {

  private getSolution(grid: number[][]) {
    const nsudoku = new Sudoku();
    nsudoku.setBoard(grid);
    const solgrid = nsudoku.solve();
    return solgrid;
  }

  private genBoard = (targetDifficulty: DifficultyType = 'Medium') => {
    const sudoku = new Sudoku({ mode: "9" });
    sudoku.generate(targetDifficulty);
    const grid = sudoku.grid;
    return {
      value: grid,
      default: structuredClone(grid),
      solution: this.getSolution(structuredClone(grid)),
      difficulty: sudoku.getDifficulty(),
    } as GridInterface;
  }

  private genBoardWithDifficulty = (targetDifficulty: DifficultyType = 'Medium'): GridInterface => {
    const maxTries = 100;
    for (let i = 0; i < maxTries; i++) {
      const board = this.genBoard(targetDifficulty);
      if (!targetDifficulty || board.difficulty.toLowerCase() === targetDifficulty.toLowerCase()) {
        return board;
      }
    }
    throw new Error(`Could not generate a board with difficulty "${targetDifficulty}" after ${maxTries} tries.`);
  };

  private getNewboard(difficulty: DifficultyType = 'Medium'): NewboardInterface {
    try {
      const board = this.genBoardWithDifficulty(difficulty);

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

  public getSudoku = (difficulty: DifficultyType = 'Medium'): SudokuInterface => {
    return {
      newboard: this.getNewboard(difficulty)
    } as SudokuInterface;
  }
}
