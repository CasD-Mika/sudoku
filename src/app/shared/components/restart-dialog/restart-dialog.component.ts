import { Component, inject } from '@angular/core';
import { DialogService } from '../../../core/services/dialog.service';
import { GameService } from '../../services/game.service';

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

  async restartGame(){
    await this.gameService.restartGame();
    this.dialogService.close();
  }

  close(){
    this.dialogService.close();
  }
}
