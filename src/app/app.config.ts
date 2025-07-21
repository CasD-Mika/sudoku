import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { GameService } from './shared/services/game.service';
import { DialogService } from './core/services/dialog.service';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    GameService,
    DialogService,
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
