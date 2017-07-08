import { Component, Input } from '@angular/core';

import { Event } from './event';

@Component({
  selector: 'scheduler-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent {
  @Input() day: Date;
  @Input() events: Event[];
  @Input() hours: number[];
}
