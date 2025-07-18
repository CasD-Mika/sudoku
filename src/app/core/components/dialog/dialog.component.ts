import { Component, ElementRef, inject, Type, ViewChild } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgComponentOutlet } from '@angular/common';

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
    this.open$.subscribe((component: Type<any>) => {
      this.currentComponent = component;
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
