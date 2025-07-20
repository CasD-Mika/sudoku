import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { GameService } from './shared/services/game.service';
import { DialogService } from './core/services/dialog.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    GameService,
    DialogService
  ]
};
