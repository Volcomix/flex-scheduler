import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding
} from '@angular/core';

import * as moment from 'moment';

import { Event } from '../event.model';

@Component({
  selector: 'scheduler-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  @Input() event: Event;
  @Output() resize = new EventEmitter<Event>();

  @HostBinding('style.top.%') get top() {
    return this.toPercent(this.event.startDate);
  }

  @HostBinding('style.bottom.%') get bottom() {
    // End hour cannot be 0h, so replace it with 24h
    return 100 - (this.toPercent(this.event.endDate) || 100);
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

  resizeEvent(mouseEvent: MouseEvent) {
    if (mouseEvent.button) { // Accept left mouse button and touch only
      return;
    }
    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();
    this.resize.emit(this.event);
  }
}
