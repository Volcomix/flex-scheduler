import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Event } from '../event.model';

@Component({
  selector: 'scheduler-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent {
  @Input() day: Date;
  @Input() hours: number[];
  @Input() events: Event[];
  @Input() step: number;
  @Output() resizeEvent = new EventEmitter<Event>();
  @Output() moveEvent = new EventEmitter<MovingEvent>();

  startResizingEvent(event: Event) {
    this.resizeEvent.emit(event);
  }

  startMovingEvent(event: Event, offset: number) {
    this.moveEvent.emit({ event, offset });
  }
}

export class MovingEvent {
  offset: number;
  event: Event;
}
