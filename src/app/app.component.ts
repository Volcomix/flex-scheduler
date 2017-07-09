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
  events: Events = {};
  step = 30;
}
