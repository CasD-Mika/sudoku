import { Component, inject } from '@angular/core';
import { DialogService } from '../shared/services/dialog.service';
import { GameService } from '../shared/services/game.service';

@Component({
  selector: 'app-restart-dialog',
  templateUrl: './restart-dialog.component.html',
  styleUrl: './restart-dialog.component.css',
  standalone: true,
  imports: []
})
export class RestartDialogComponent {
  dialogService = inject(DialogService);
  gameService = inject(GameService);

  restart(){
    this.gameService.restartGame();
    this.dialogService.close();
  }

  close(){
    this.dialogService.close();
  }
}
