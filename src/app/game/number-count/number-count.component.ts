import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-number-count',
  templateUrl: './number-count.component.html',
  styleUrl: './number-count.component.css',
  standalone: true,
  imports: []
})
export class NumberCountComponent {
  @Input({ required: true }) cellNumber!: number;
}
