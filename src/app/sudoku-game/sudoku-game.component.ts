import { Component, inject, Input } from '@angular/core';
import { SudokuGridComponent } from '../sudoku-grid/sudoku-grid.component';
import { GameService } from '../shared/services/game.service';
import { LoadingComponent } from "../loading/loading.component";
import { NumberSelectorComponent } from "../number-selector/number-selector.component";
import { SudokuFetchInterface } from '../shared/interfaces/sudoku-fetch.interface';

@Component({
  selector: 'app-sudoku-game',
  templateUrl: './sudoku-game.component.html',
  styleUrl: './sudoku-game.component.css',
  standalone: true,
  imports: [
    SudokuGridComponent, LoadingComponent, NumberSelectorComponent
  ]
})
export class SudokuGameComponent {
  gameService = inject(GameService);

  @Input() sudokuFetch: SudokuFetchInterface | null = null;

  reset(event: Event){
    this.gameService.resetGame();
    (event.target as HTMLButtonElement).blur();
  }

  newGame(event: Event){
    this.gameService.newGame();
    (event.target as HTMLButtonElement).blur();
  }
}
