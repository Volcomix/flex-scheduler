import { Component } from '@angular/core';

import { Event } from './event';

@Component({
  selector: 'scheduler-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  events = [new Event(
    new Date('2017-07-08 10:00:00'),
    new Date('2017-07-08 14:00:00')
  )];
}
