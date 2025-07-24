import {ApplicationRef, inject, Injectable} from '@angular/core';
import {SwUpdate, VersionReadyEvent} from '@angular/service-worker';
import {concat, interval} from 'rxjs';
import {filter, first, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SwUpdateService {
  private appRef = inject(ApplicationRef);
  private swUpdate = inject(SwUpdate);

  appIsStable$ = this.appRef.isStable.pipe(first((isStable) => isStable === true));
  everyMinute$ = interval(60 * 1000);
  everyMinuteOnceAppIsStable$ = concat(this.appIsStable$, this.everyMinute$);

  checkForUpdate() {
    if (!this.swUpdate.isEnabled){
      return;
    }

    this.everyMinuteOnceAppIsStable$.subscribe(() => {
      try {
        this.swUpdate.checkForUpdate();
      } catch (err) {
        console.error('Failed to check for updates:', err);
      }
    });

    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe(() => {
        this.swUpdate.activateUpdate();
        document.location.reload();
      });
  }
}
