import { Component, inject } from '@angular/core';
import { SudokuGameComponent } from './game/sudoku-game/sudoku-game.component';
import { GameService } from './shared/services/game.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { DialogComponent } from './core/components/dialog/dialog.component';
import { SwUpdateService } from './shared/services/sw-update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [
    SudokuGameComponent, AsyncPipe, NgClass,
    DialogComponent
]
})
export class AppComponent {
  gameService = inject(GameService);
  swUpdateService = inject(SwUpdateService);

  ngOnInit() {
    this.swUpdateService.checkForUpdate();
  }
}
