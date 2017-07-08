import { Component, Input } from '@angular/core';

import * as moment from 'moment';

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
      const day = moment(this.date)
        .startOf('week')
        .add(i, 'day');
      this.days.push(day.toDate());
    }
    this.hours = [];
    for (let i = 0; i < 24; i++) {
      this.hours.push(i);
    }
  }
}
