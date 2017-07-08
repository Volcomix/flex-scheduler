import { Component } from '@angular/core';

import * as moment from 'moment';

import { Event } from './event';
import { Events } from './events';

@Component({
  selector: 'scheduler-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  date = new Date();
  events: Events = {
    [+moment().startOf('day').toDate()]: [
      new Event(
        new Date('2017-07-08 10:00:00'),
        new Date('2017-07-08 14:00:00')
      )
    ]
  };
  step = 30;
}
