import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { SudokuService } from './shared/services/sudoku.service';
import { GameService } from './shared/services/game.service';
import { DialogService } from './core/services/dialog.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    SudokuService,
    GameService,
    DialogService
  ]
};
