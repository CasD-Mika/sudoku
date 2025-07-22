import { Injectable } from "@angular/core";
import { SudokuInterface } from "../interfaces/sudoku.interface";
import { BehaviorSubject, catchError, concatWith, fromEvent, map, Observable, of, shareReplay, startWith, Subject, switchMap, tap, timer } from "rxjs";
import { SudokuMetaInterface } from "../interfaces/sudoku-meta.interface";
import { CellInterface } from "../interfaces/cell.interface";
import { DifficultyType } from "../types/difficulty.type";

@Injectable()
export class GameService {
  // injected dependencies
  sudokuWorker = new Worker(new URL('../../shared/workers/sudoku.worker.ts', import.meta.url));

  // subjects
  private loadSudokuSubject = new Subject<void>();
  private invalidInputTriggerSubject = new Subject<CellInterface | null>();
  private difficultySubject = new BehaviorSubject<DifficultyType>('Medium');
  private sudokuSubject = new BehaviorSubject<SudokuInterface | null>(null);
  private selectedCellSubject = new BehaviorSubject<CellInterface | null>(null);
  private numberCountMapSubject = new BehaviorSubject<Map<number, number>>(new Map());

  // observables

  get difficulty$() {
    return this.difficultySubject.asObservable();
  }

  get sudoku$(){
    return this.sudokuSubject.asObservable();
  }

  get selectedCell$(){
    return this.selectedCellSubject.asObservable();
  }

  get finished$(){
    return this.numberCountMapSubject.asObservable().pipe(
      map(numberCountMap => {
        if (!numberCountMap) return false;

        for (let i = 1; i <= 9; i++) {
          if (numberCountMap.get(i) !== 9) {
            return false;
          }
        }
        return true;
      }
    ));
  }

  sudokuFetch$: Observable<SudokuMetaInterface> = this.loadSudokuSubject.pipe(
    startWith(void 0),
    tap(() => this.sudokuWorker.postMessage({ difficulty: this.difficultySubject.value })),
    switchMap(() =>
      of(<SudokuMetaInterface>{ sudoku: null, loading: true, error: null }).pipe(
        concatWith(
          fromEvent<MessageEvent>(this.sudokuWorker, 'message').pipe(
            map(event => event.data as SudokuInterface),
            this.fillNumberCountMap(),
            this.enrichSudokuWithDefault(),
            catchError(error => {
              console.error('Error fetching Sudoku:', error);
              return of(<SudokuMetaInterface>{ sudoku: null, loading: false, error });
            })
          )
        )
      )
    ),
    shareReplay(1)
  );

  enrichSudokuWithDefault = () => {
    return (source: Observable<SudokuInterface>) => source.pipe(
      map(sudoku => {
        const grid = sudoku.newboard.grid;

        if (!grid){
          throw new Error("Grid is null or undefined in enrichSudokuWithDefault");
        }

        const defaultValue = structuredClone(grid.value);

        const enrichedSudoku: SudokuInterface = {
          ...sudoku,
          newboard: {
            ...sudoku.newboard,
            grid: {
              ...grid,
              default: defaultValue
            }
          }
        };

        this.sudokuSubject.next(enrichedSudoku);
        return <SudokuMetaInterface>{ sudoku: enrichedSudoku, loading: false, error: null };
      }),
    );
  }

  fillNumberCountMap = () => {
    return (source: Observable<SudokuInterface>) => source.pipe(
      map(sudoku => {
        const grid = sudoku.newboard.grid;

        if (!grid){
          throw new Error("Grid is null or undefined in fillNumberCountMap");
        }

        const numberCountMap = new Map<number, number>();

        for (let row of grid.value) {
          for (let cell of row) {
            if (cell !== 0) {
              numberCountMap.set(cell, (numberCountMap.get(cell) || 0) + 1);
            }
          }
        }

        this.numberCountMapSubject.next(numberCountMap);

        return sudoku;
      })
    );
  }

  invalidInput$: Observable<CellInterface | null> = this.invalidInputTriggerSubject.pipe(
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

  // functions

  setDifficulty(difficulty: DifficultyType) {
    this.difficultySubject.next(difficulty);
  }

  updateCellWithSelected(value: number) {
    const selectedCell = this.selectedCellSubject.value;
    if (!selectedCell) return;

    if (selectedCell.number === 0){
      this.updateCell(selectedCell.rowIndex, selectedCell.columnIndex, value);
    }
  }

  numberFinished(value: number): boolean {
    if (!this.numberCountMapSubject.value) {
      return false;
    }

    const count = this.numberCountMapSubject.value.get(value);

    return count! === 9;
  }

  updateCell(rowIndex: number, columnIndex: number, value: number) {
    const sudoku = this.sudokuSubject.value;
    if (!sudoku) return;

    const grid = sudoku.newboard.grid;

    if (!grid || !grid.value) return;

    if (grid.solution[rowIndex][columnIndex] === value) {
      const updateSudoku: SudokuInterface = {
        ...sudoku,
        newboard: {
          ...sudoku.newboard,
          grid: {
            ...grid,
            value: grid.value.map((rowCells, rIndex) =>
              rowCells.map((cell, cIndex) =>
                rIndex === rowIndex && cIndex === columnIndex ? value : cell
              )
            )
          }
        }
      };

      const numberCountMap = this.numberCountMapSubject.value;
      const count = numberCountMap.get(value);
      numberCountMap.set(value, count! + 1);
      this.numberCountMapSubject.next(numberCountMap);

      this.sudokuSubject.next(updateSudoku);
      this.setSelectedCell({ rowIndex: -1, columnIndex: -1, number: value });
      this.invalidInputTriggerSubject.next(null);
    }
    else {
      this.invalidInputTriggerSubject.next(<CellInterface | null>{ rowIndex: rowIndex, columnIndex: columnIndex, number: value });
    }
  }

  newGame() {
    this.loadSudokuSubject.next();
    this.selectedCellSubject.next(null);
    this.invalidInputTriggerSubject.next(null);
  }

  restartGame() {
    const sudoku = this.sudokuSubject.value;
    if (!sudoku) return;

    const grid = sudoku.newboard.grid;

    if (!grid || !grid.value) return;

    grid.value = structuredClone(grid.default);

    this.sudokuSubject.next(sudoku);
    this.selectedCellSubject.next(null);
    this.invalidInputTriggerSubject.next(null);
  }

  setSelectedCell(cell: CellInterface | null){
    if (cell && this.numberFinished(cell.number)){
      return;
    }

    this.invalidInputTriggerSubject.next(null);

    if (!cell){
      this.selectedCellSubject.next(null);
      return;
    }

    if (!this.selectedCellSubject.value){
      if (cell.number !== 0){
        this.selectedCellSubject.next({
          ...cell,
          rowIndex: -1,
          columnIndex: -1
        });
        return;
      }

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

    if (cell.number !== 0){
      this.selectedCellSubject.next({
        ...cell,
        rowIndex: -1,
        columnIndex: -1
      });
      return;
    }


    this.selectedCellSubject.next(cell);
  }
}
