import { Injectable, Type } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private openDialogSubject = new Subject<Type<any>>();
  private closeDialogSubject = new Subject<void>();
  private dataSubject = new BehaviorSubject<any>(null);

  open$ = this.openDialogSubject.asObservable();
  close$ = this.closeDialogSubject.asObservable();
  data$ = this.dataSubject.asObservable();

  open(component: Type<any>, data: any = null) {
    this.dataSubject.next(data);
    this.openDialogSubject.next(component);
  }

  close() {
    this.closeDialogSubject.next();
    this.dataSubject.next(null);
  }
}
