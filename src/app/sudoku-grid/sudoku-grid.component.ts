import { Component, HostListener, inject } from '@angular/core';
import { SudokuCellComponent } from '../sudoku-cell/sudoku-cell.component';
import { GameService } from '../shared/services/game.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { CellInterface } from '../shared/interfaces/cell.interface';
import { DIGITS } from '../shared/constants/digits';

@Component({
  selector: 'app-sudoku-grid',
  templateUrl: './sudoku-grid.component.html',
  styleUrl: './sudoku-grid.component.css',
  standalone: true,
  imports: [
    SudokuCellComponent, AsyncPipe, NgClass
  ]
})
export class SudokuGridComponent {
  gameService = inject(GameService);

  @HostListener('window:keydown', ['$event'])
  buttonPressed(event: KeyboardEvent){
    if (DIGITS.includes(event.code)) {
      const digitIndex = DIGITS.indexOf(event.code);
      if (digitIndex >= 0) {
        this.gameService.updateCellWithSelected(digitIndex + 1);
      }
    }
  }

  getCellNumber(invalidInput: CellInterface | null, rowIndex: number, columnIndex: number, value: number): number {
    if (invalidInput !== null && invalidInput.rowIndex === rowIndex && invalidInput.columnIndex === columnIndex){
      return invalidInput.number
    }
    else{
      return value;
    }
  }

  isSelected(selectedCell: CellInterface | null, rowIndex: number, columnIndex: number, value: number): boolean {
    return selectedCell !== null && (
      (selectedCell.rowIndex === rowIndex &&
       selectedCell.columnIndex === columnIndex) ||
      (selectedCell.number === value &&
       selectedCell.number !== 0));
  }

  isMarked(selectedCell: CellInterface | null, rowIndex: number, columnIndex: number): boolean {
    return selectedCell !== null &&
      selectedCell.number === 0 &&
      (selectedCell.rowIndex === rowIndex ||
       selectedCell.columnIndex === columnIndex);
  }

  isInvalid(invalidInput: CellInterface | null, rowIndex: number, columnIndex: number): boolean {
    return invalidInput !== null &&
      invalidInput.rowIndex === rowIndex &&
      invalidInput.columnIndex === columnIndex;
  }
}
