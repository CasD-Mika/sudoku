import { Component, inject } from '@angular/core';
import { DialogService } from '../shared/services/dialog.service';
import { GameService } from '../shared/services/game.service';
import { NgClass } from '@angular/common';

export type Difficulties = 'Easy' | 'Medium' | 'Hard';

@Component({
  selector: 'app-new-game-dialog',
  templateUrl: './new-game-dialog.component.html',
  styleUrl: './new-game-dialog.component.css',
  standalone: true,
  imports: [
    NgClass
  ]
})
export class NewGameDialogComponent {
  dialogService = inject(DialogService);
  gameService = inject(GameService);

  selectedDifficulty: Difficulties = 'Medium';

  ngOnInit() {
    this.selectedDifficulty = this.gameService.difficulty;
  }

  setDifficulty(difficulty: Difficulties) {
    this.selectedDifficulty = difficulty;
  }

  newGame(){
    this.gameService.difficulty = this.selectedDifficulty;
    this.gameService.newGame();
    this.dialogService.close();
  }

  close(){
    this.dialogService.close();
  }
}
