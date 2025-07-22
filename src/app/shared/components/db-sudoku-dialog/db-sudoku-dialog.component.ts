import { Component, inject } from '@angular/core';
import { DialogService } from '../../../core/services/dialog.service';
import { GameService } from '../../services/game.service';
import { NewGameDialogComponent } from '../new-game-dialog/new-game-dialog.component';

@Component({
  selector: 'app-db-sudoku-dialog',
  templateUrl: './db-sudoku-dialog.component.html',
  styleUrl: './db-sudoku-dialog.component.css',
  standalone: true,
  imports: []
})
export class DbSudokuDialogComponent {
  dialogService = inject(DialogService);
  gameService = inject(GameService);

  async newGame(){
    this.dialogService.close();
    this.dialogService.open(NewGameDialogComponent, { title: 'Neues Spiel', message: 'Wollen Sie wirklich ein neues Spiel starten? Der aktuelle Spielfortschritt geht verloren.' });
  }

  close(){
    this.dialogService.close();
  }
}
