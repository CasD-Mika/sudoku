import { Component, inject, Input } from '@angular/core';
import { SudokuGridComponent } from '../sudoku-grid/sudoku-grid.component';
import { GameService } from '../../shared/services/game.service';
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { NumberSelectorComponent } from "../number-selector/number-selector.component";
import { SudokuMetaInterface } from '../../shared/interfaces/sudoku-meta.interface';
import { DialogService } from '../../core/services/dialog.service';
import { RestartDialogComponent } from '../../shared/components/restart-dialog/restart-dialog.component';
import { NewGameDialogComponent } from '../../shared/components/new-game-dialog/new-game-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

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
  dialogService = inject(DialogService);

  @Input() sudokuFetch: SudokuMetaInterface | null = null;

  finished$ = this.gameService.finished$.pipe(
    filter(finished => finished === true),
    takeUntilDestroyed()
  );

  showResetButtonRow = false;

  ngOnInit() {
    this.finished$.subscribe(() => {
      this.dialogService.open(NewGameDialogComponent, { title: 'Glückwunsch 🎉', message: 'Du hast das Sudoku erfolgreich gelöst. Möchtest du ein neues Spiel starten?' });
    });
  }

  openRestartDialog(){
    this.dialogService.open(RestartDialogComponent);
  }

  openNewGameDialog(){
    this.dialogService.open(NewGameDialogComponent, { title: 'Neues Spiel', message: 'Wollen Sie wirklich ein neues Spiel starten? Der aktuelle Spielfortschritt geht verloren.' });
  }

  newGame(){
    this.gameService.newGame();
  }
}
