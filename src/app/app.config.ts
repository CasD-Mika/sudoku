import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { GameService } from './shared/services/game.service';
import { DialogService } from './core/services/dialog.service';
import { provideServiceWorker } from '@angular/service-worker';
import { IndexedDBService } from './shared/services/indexed-db.service';
import { SwUpdateService } from './shared/services/sw-update.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    GameService,
    DialogService,
    IndexedDBService,
    SwUpdateService
  ]
};
