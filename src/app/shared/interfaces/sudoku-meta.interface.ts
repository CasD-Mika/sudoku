import { SudokuInterface } from "./sudoku.interface";

export interface SudokuMetaInterface {
  sudoku: SudokuInterface | null,
  loading: boolean,
  error: any
}
