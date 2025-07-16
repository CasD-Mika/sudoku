import { Injectable, Type } from '@angular/core';
import { Subject } from 'rxjs';
import { DialogConfigInterface } from '../interfaces/dialog-config.interface';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private openDialogSubject = new Subject<DialogConfigInterface>();
  private closeDialogSubject = new Subject<void>();

  open$ = this.openDialogSubject.asObservable();
  close$ = this.closeDialogSubject.asObservable();

  open(component: Type<any>, data?: any) {
    this.openDialogSubject.next({ component, data });
  }

  close() {
    this.closeDialogSubject.next();
  }
}
