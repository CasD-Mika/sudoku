import { inject, Injectable } from "@angular/core";
import { SudokuInterface } from "../interfaces/sudoku.interface";
import { BehaviorSubject, catchError, concatWith, map, mergeMap, Observable, of, shareReplay, startWith, Subject, switchMap, tap, timer } from "rxjs";
import { DosukuHttpService } from "./dosuku.service";
import { SudokuFetchInterface } from "../interfaces/sudoku-fetch.interface";
import { CellInterface } from "../interfaces/cell.interface";

@Injectable()
export class GameService {
  private dosukuHttpService = inject(DosukuHttpService)

  private loadSudoku$ = new Subject<void>();

  sudokuSubject = new BehaviorSubject<SudokuInterface | null>(null);

  sudokuFetch$: Observable<SudokuFetchInterface> = this.loadSudoku$.pipe(
    startWith(void 0),
    switchMap(() =>
      of(<SudokuFetchInterface>{ sudoku: null, loading: true, error: null }).pipe(
        concatWith(
          this.dosukuHttpService.getSingle<SudokuInterface>().pipe(
            map(sudoku => {
              const grid = sudoku.newboard.grids[0];
              const defaultValue = structuredClone(grid.value);

              const enrichedSudoku: SudokuInterface = {
                ...sudoku,
                newboard: {
                  ...sudoku.newboard,
                  grids: [{
                    ...grid,
                    default: defaultValue
                  }]
                }
              };

              this.sudokuSubject.next(enrichedSudoku);
              return <SudokuFetchInterface>{ sudoku: enrichedSudoku, loading: false, error: null };
            }),
            catchError(error => of(<SudokuFetchInterface>{ sudoku: null, loading: false, error }))
          )
        )
      )
    ),
    shareReplay(1)
  );


  get sudoku$(){
    return this.sudokuSubject.asObservable();
  }

  updateCellWithSelected(value: number) {
    const selectedCell = this.selectedCellSubject.value;
    if (!selectedCell) return;

    if (selectedCell.number === 0){
      this.updateCell(selectedCell.rowIndex, selectedCell.columnIndex, value);
    }
  }

  updateCell(rowIndex: number, columnIndex: number, value: number) {
    const sudoku = this.sudokuSubject.value;
    if (!sudoku) return;

    const grid = sudoku.newboard.grids[0];

    if (grid.solution[rowIndex][columnIndex] === value) {
      const updateSudoku: SudokuInterface = {
        ...sudoku,
        newboard: {
          ...sudoku.newboard,
          grids: [{
            ...grid,
            value: grid.value.map((rowCells, rIndex) =>
              rowCells.map((cell, cIndex) =>
                rIndex === rowIndex && cIndex === columnIndex ? value : cell
              )
            )
          }]
        }
      };

      this.sudokuSubject.next(updateSudoku);
      this.setSelectedCell(null);
      this.invalidInputTrigger.next(null);
    }
    else {
      this.invalidInputTrigger.next(<CellInterface | null>{ rowIndex: rowIndex, columnIndex: columnIndex, number: value });
    }
  }

  private invalidInputTrigger = new Subject<CellInterface | null>();

  invalidInput$: Observable<CellInterface | null> = this.invalidInputTrigger.pipe(
  switchMap(input => {
    if (!input) {
      return of(null);
    }
    else {
      return timer(800).pipe(
        startWith(input),
        map(t => t === 0 ? null : input)
      )
    }
  })
);

  newGame() {
    this.loadSudoku$.next();
    this.selectedCellSubject.next(null);
    this.invalidInputTrigger.next(null);
  }

  resetGame() {
    const sudoku = this.sudokuSubject.value;
    if (!sudoku) return;

    const grid = sudoku.newboard.grids[0];
    grid.value = structuredClone(grid.default);

    this.sudokuSubject.next(sudoku);
    this.selectedCellSubject.next(null);
    this.invalidInputTrigger.next(null);
  }

  private selectedCellSubject: BehaviorSubject<CellInterface | null> = new BehaviorSubject<CellInterface | null>(null);

  get selectedCell$(){
    return this.selectedCellSubject.asObservable();
  }

  setSelectedCell(cell: CellInterface | null){
    this.invalidInputTrigger.next(null);

    if (!cell){
      this.selectedCellSubject.next(null);
      return;
    }

    if (!this.selectedCellSubject.value){
      this.selectedCellSubject.next(cell);
      return;
    }

    if (this.selectedCellSubject.value.number !== 0 && cell.number !== 0 && this.selectedCellSubject.value.number === cell.number) {
      this.selectedCellSubject.next(null);
      return;
    }

    if (
      this.selectedCellSubject.value.rowIndex !== -1 &&
      cell.rowIndex !== -1 &&
      this.selectedCellSubject.value.columnIndex !== -1 &&
      cell.columnIndex !== -1 &&
      this.selectedCellSubject.value.rowIndex === cell.rowIndex &&
      this.selectedCellSubject.value.columnIndex === cell.columnIndex
    ) {
      this.selectedCellSubject.next(null);
      return;
    }

    this.selectedCellSubject.next(cell);
  }
}
