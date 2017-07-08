import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as moment from 'moment';

import { Events } from './events';
import { Day } from './day';

@Component({
  selector: 'scheduler-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent implements OnChanges {
  @Input() date: Date;
  @Input() events: Events;
  @Input() step: number;

  days: Day[];
  hours: number[];

  constructor() {
    this.hours = [];
    for (let i = 0; i < 24; i++) {
      this.hours.push(i);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const date: Date = changes.date.currentValue;
    const events: Events = changes.events.currentValue;
    const hasDateChanged = date !== changes.date.previousValue;
    const hasEventsChanged = events !== changes.events.previousValue;
    if (!hasDateChanged && !hasEventsChanged) {
      return;
    }
    this.days = [];
    for (let i = 0; i < 7; i++) {
      const day = moment(date)
        .startOf('week')
        .add(i, 'day')
        .toDate();
      events[+day] = events[+day] || [];
      this.days.push({
        date: day,
        events: events[+day]
      });
    }
  }
}
