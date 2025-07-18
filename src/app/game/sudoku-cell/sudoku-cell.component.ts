import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sudoku-cell',
  templateUrl: './sudoku-cell.component.html',
  styleUrl: './sudoku-cell.component.css',
  standalone: true,
  imports: [
    NgClass
  ]
})
export class SudokuCellComponent {
  @Input({required: true}) cellNumber!: number;
  @Input({required: true}) selected!: boolean;
  @Input({required: true}) marked!: boolean;
  @Input({required: true}) invalid!: boolean;
  @Input() numberFinished: boolean = false;
}
