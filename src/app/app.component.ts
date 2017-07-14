import { Component } from '@angular/core';

import { Event } from './scheduler/event.model';

@Component({
  selector: 'scheduler-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  date = new Date();
  events: Event[] = [];
  step = 30;
}
