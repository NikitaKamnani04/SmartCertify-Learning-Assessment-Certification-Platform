import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tech-filter',
  imports: [CommonModule],
  templateUrl: './tech-filter.component.html',
  styleUrl: './tech-filter.component.css'
})
export class TechFilterComponent {
  @Input() techList: { name: string; image: string }[] = []; // Array of techs with name and image
  @Output() filterCourses = new EventEmitter<string>(); // Emit selected tech name

  selectTechnology(tech: string): void {
    this.filterCourses.emit(tech); // Emit selected tech to parent component
  }
}
