import { Component } from '@angular/core';

@Component({
  selector: 'scheduler-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent {
  hours: number[];

  constructor() {
    this.hours = [];
    for (let i = 0; i < 24; i++) {
      this.hours.push(i);
    }
  }
}
