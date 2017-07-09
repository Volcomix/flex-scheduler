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
    this.createEvent(mouseEvent.clientY);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(touchEvent: TouchEvent) {
    this.createEvent(touchEvent.touches[0].clientY);
    touchEvent.preventDefault();
  }

  private createEvent(clientY: number) {
    const startDate = this.getDate(clientY);
    const endDate = moment(startDate)
      .add(this.step, 'minutes')
      .toDate();
    this.event = new Event(startDate, endDate);
    this.events.push(this.event);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(mouseEvent: MouseEvent) {
    this.resizeEvent(mouseEvent.clientY);
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(touchEvent: TouchEvent) {
    this.resizeEvent(touchEvent.touches[0].clientY);
  }

  private resizeEvent(clientY: number) {
    if (!this.event) {
      return;
    }
    this.event.endDate = this.getDate(clientY);
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onTouchEnd() {
    if (!this.event) {
      return;
    }
    this.event = undefined;
  }

  private getDate(clientY: number) {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const max = rect.bottom - rect.top;
    const y = clientY - rect.top;
    let minutes = Event.minutesPerDay * y / max;
    minutes = Math.round(minutes / this.step) * this.step;
    return moment(this.day)
      .minutes(minutes)
      .toDate();
  }
}
