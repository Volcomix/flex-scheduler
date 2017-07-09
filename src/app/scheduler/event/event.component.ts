import { Component, Input } from '@angular/core';

import { Event } from '../event.model';

@Component({
  selector: 'scheduler-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  @Input() event: Event;
}
