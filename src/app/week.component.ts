import { Component, Input } from '@angular/core';

@Component({
  selector: 'scheduler-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent {
  @Input() date: Date;

  days: Date[];

  constructor() {
    this.days = [];
    for (let i = 0; i < 7; i++) {
      this.days.push(this.date);
    }
  }
}
