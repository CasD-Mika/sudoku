import { Component, ElementRef, inject, Type, ViewChild } from '@angular/core';
import { DialogService } from '../shared/services/dialog.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgComponentOutlet } from '@angular/common';
import { DialogConfigInterface } from '../shared/interfaces/dialog-config.interface';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
  standalone: true,
  imports: [
    NgComponentOutlet
  ]
})
export class DialogComponent {
  dialogService = inject(DialogService);

  @ViewChild('dialog') dialogRef!: ElementRef<HTMLDialogElement>;

  currentComponent?: Type<any>;

  open$ = this.dialogService.open$.pipe(
    takeUntilDestroyed()
  );

  close$ = this.dialogService.close$.pipe(
    takeUntilDestroyed()
  );

  ngOnInit() {
    this.open$.subscribe((config: DialogConfigInterface) => {
      this.currentComponent = config.component;
      this.dialogRef.nativeElement.showModal();
    });

    this.close$.subscribe(() => {
      this.currentComponent = undefined;
      this.dialogRef.nativeElement.close();
    });
  }

  close() {
    this.dialogService.close();
  }
}
