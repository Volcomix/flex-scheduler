import { Component, Input } from '@angular/core';

import { Event } from './event';

@Component({
  selector: 'scheduler-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent {
  @Input() date: Date;
  @Input() events: Event[];

  days: Date[];
  hours: number[];

  constructor() {
    this.days = [];
    for (let i = 0; i < 7; i++) {
      this.days.push(new Date());
    }
    this.hours = [];
    for (let i = 0; i < 24; i++) {
      this.hours.push(i);
    }
  }
}
