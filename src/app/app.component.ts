import { Component } from '@angular/core';

import { Events } from './scheduler/events.model';

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
