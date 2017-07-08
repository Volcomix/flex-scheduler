import { Component, Input } from '@angular/core';

import * as moment from 'moment';

import { Events } from './events';

@Component({
  selector: 'scheduler-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent {
  @Input() date: Date;
  @Input() events: Events;

  hours: number[];

  constructor() {
    this.hours = [];
    for (let i = 0; i < 24; i++) {
      this.hours.push(i);
    }
  }

  get days() {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = moment(this.date)
        .startOf('week')
        .add(i, 'day');
      days.push(day.toDate());
    }
    return days;
  }

  getEvents(day: Date) {
    return this.events[+day];
  }
}
