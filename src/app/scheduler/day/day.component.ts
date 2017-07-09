import { Component, Input, HostListener, ElementRef } from '@angular/core';

import * as moment from 'moment';

import { Event } from '../event.model';

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

  resizingEvent: Event;

  private startDate: Date;

  constructor(private el: ElementRef) { }

  @HostListener('mousedown', ['$event'])
  onMouseDown(mouseEvent: MouseEvent) {
    if (mouseEvent.button !== 0) {
      return;
    }
    this.createEvent(mouseEvent.clientY);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(touchEvent: TouchEvent) {
    this.createEvent(touchEvent.touches[0].clientY);
    touchEvent.preventDefault();
  }

  private createEvent(clientY: number) {
    this.startDate = this.getDate(clientY);
    const endDate = moment(this.startDate)
      .add(this.step, 'minutes')
      .toDate();
    this.resizingEvent = new Event(this.startDate, endDate);
    this.events.push(this.resizingEvent);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(mouseEvent: MouseEvent) {
    if (mouseEvent.button !== 0) {
      return;
    }
    mouseEvent.preventDefault();
    this.resizeEvent(mouseEvent.clientY);
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(touchEvent: TouchEvent) {
    this.resizeEvent(touchEvent.touches[0].clientY);
  }

  private resizeEvent(clientY: number) {
    if (!this.resizingEvent) {
      return;
    }
    const date = this.getDate(clientY);
    if (date <= this.startDate) {
      this.resizingEvent.startDate = date;
    } else {
      this.resizingEvent.endDate = date;
    }
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onTouchEnd() {
    if (!this.resizingEvent) {
      return;
    }
    this.resizingEvent = undefined;
    this.startDate = undefined;
  }

  private getDate(clientY: number) {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const max = rect.bottom - rect.top;
    const y = clientY - rect.top;
    let minutes = Event.minutesPerDay * y / max;
    minutes = Math.round(minutes / this.step) * this.step;
    if (minutes < 0) {
      minutes = 0;
    } else if (minutes > Event.minutesPerDay) {
      minutes = Event.minutesPerDay;
    }
    return moment(this.day)
      .minutes(minutes)
      .toDate();
  }
}
