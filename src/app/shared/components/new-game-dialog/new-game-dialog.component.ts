import { Component, inject } from '@angular/core';
import { DialogService } from '../../../core/services/dialog.service';
import { GameService } from '../../services/game.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { take } from 'rxjs';
import { DifficultyType } from '../../types/difficulty.type';

@Component({
  selector: 'app-new-game-dialog',
  templateUrl: './new-game-dialog.component.html',
  styleUrl: './new-game-dialog.component.css',
  standalone: true,
  imports: [
    NgClass, AsyncPipe
  ]
})
export class NewGameDialogComponent {
  dialogService = inject(DialogService);
  gameService = inject(GameService);

  selectedDifficulty: DifficultyType = 'Medium';

  getCurrentDifficulty$ = this.gameService.difficulty$.pipe(
    take(1)
  );

  ngOnInit() {
    this.getCurrentDifficulty$.subscribe(difficulty => this.selectedDifficulty = difficulty);
  }

  setDifficulty(difficulty: DifficultyType) {
    this.selectedDifficulty = difficulty;
  }

  newGame(){
    this.gameService.setDifficulty(this.selectedDifficulty);
    this.gameService.newGame();
    this.dialogService.close();
  }

  close(){
    this.dialogService.close();
  }
}
