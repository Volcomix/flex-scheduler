import { Component, Input, HostBinding } from '@angular/core';

import * as moment from 'moment';

import { Event } from '../event.model';

@Component({
  selector: 'scheduler-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  @Input() event: Event;

  @HostBinding('style.top.%') get top() {
    return this.toPercent(this.event.startDate);
  }

  @HostBinding('style.bottom.%') get bottom() {
    return 100 - this.toPercent(this.event.endDate);
  }

  @HostBinding('class.compact') get isCompact() {
    const startDate = moment(this.event.startDate);
    const endDate = moment(this.event.endDate);
    const duration = endDate.diff(startDate, 'minutes');
    return duration < 60;
  }

  private toPercent(date: Date) {
    const hours = date.getHours();
    const minutes = hours * 60 + date.getMinutes();
    return 100 * minutes / Event.minutesPerDay;
  }
}
