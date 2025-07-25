import { Component, inject } from '@angular/core';
import { SudokuCellComponent } from "../sudoku-cell/sudoku-cell.component";
import { AsyncPipe } from '@angular/common';
import { GameService } from '../../shared/services/game.service';
import { CellInterface } from '../../shared/interfaces/cell.interface';
import { NumberCountComponent } from "../number-count/number-count.component";

@Component({
  selector: 'app-number-selector',
  templateUrl: './number-selector.component.html',
  styleUrl: './number-selector.component.css',
  standalone: true,
  imports: [
    SudokuCellComponent, AsyncPipe, NumberCountComponent
]
})
export class NumberSelectorComponent {
  gameService = inject(GameService);

  private readonly numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  get firstRow(): number[] {
    return this.numbers.slice(0, 5);
  }

  get secondRow(): number[] {
    return this.numbers.slice(5);
  }

  isSelected(number: number, selectedCell: CellInterface | null): boolean {
    return selectedCell !== null && selectedCell.number === number;
  }

  async onClick(number: number, selectedCell: CellInterface | null){
    if (!this.gameService.numberFinished(number)){
      if (!selectedCell || (selectedCell.rowIndex === -1 && selectedCell.columnIndex === -1)) {
        this.gameService.setSelectedCell({
          rowIndex: -1,
          columnIndex: -1,
          number
        });
      }
      else {
        await this.gameService.updateCellWithSelected(number);
      }
    }
  }
}
