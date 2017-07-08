import { Component, Input, HostListener, ElementRef } from '@angular/core';

import * as moment from 'moment';

import { Event } from './event';

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

  private event: Event;

  constructor(private el: ElementRef) { }

  @HostListener('mousedown', ['$event'])
  onMouseDown(mouseEvent: MouseEvent) {
    const startDate = this.getDate(mouseEvent);
    const endDate = moment(startDate)
      .add(this.step, 'minutes')
      .toDate();
    this.event = new Event(startDate, endDate);
    this.events.push(this.event);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(mouseEvent: MouseEvent) {
    if (!this.event) {
      return;
    }
    this.event.endDate = this.getDate(mouseEvent);
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (!this.event) {
      return;
    }
    this.event = undefined;
  }

  private getDate(event: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const max = rect.bottom - rect.top;
    const y = event.clientY - rect.top;
    let minutes = Event.minutesPerDay * y / max;
    minutes = Math.round(minutes / this.step) * this.step;
    return moment(this.day)
      .minutes(minutes)
      .toDate();
  }
}
