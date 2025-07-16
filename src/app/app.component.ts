import { Component, inject } from '@angular/core';
import { SudokuGameComponent } from './sudoku-game/sudoku-game.component';
import { GameService } from './shared/services/game.service';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [
    SudokuGameComponent, AsyncPipe, NgClass
  ]
})
export class AppComponent {
  gameService = inject(GameService);
}
