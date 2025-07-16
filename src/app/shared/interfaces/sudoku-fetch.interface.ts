import { SudokuInterface } from "./sudoku.interface";

export interface SudokuFetchInterface {
  sudoku: SudokuInterface | null,
  loading: boolean,
  error: any
}
