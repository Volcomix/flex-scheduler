import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  HostListener,
  HostBinding,
} from '@angular/core';

import * as moment from 'moment';

import { Event } from '../event.model';

@Component({
  selector: 'scheduler-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent {
  @Input() events: Event[];
  @Input() step: number;

  @ViewChild('eventsContainer') eventsContainer: ElementRef;

  days: Date[];
  hours: number[];

  private resizingEvent: Event;
  private resizeStartDate: Date;
  private movingEvent: Event;
  private moveOffset: number;

  constructor(el: ElementRef) {
    this.hours = [];
    for (let i = 0; i < 24; i++) {
      this.hours.push(i);
    }
  }

  @Input() set date(date: Date) {
    this.days = [];
    for (let i = 0; i < 7; i++) {
      const day = moment(date)
        .startOf('week')
        .add(i, 'day')
        .toDate();
      this.days.push(day);
    }
  }

  @HostBinding('class.resizing') get isResizingEvent(): boolean {
    return this.resizingEvent !== undefined;
  }

  @HostBinding('class.moving') get isMovingEvent(): boolean {
    return this.movingEvent !== undefined;
  }

  startResizingEvent(event: Event) {
    this.resizingEvent = event;
  }

  startMovingEvent(event: Event, offset: number) {
    this.movingEvent = event;
    this.moveOffset = offset;
  }

  onMouseDown(mouseEvent: MouseEvent) {
    if (mouseEvent.button !== 0) {
      return;
    }
    this.createEvent(mouseEvent);
  }

  onTouchStart(touchEvent: TouchEvent) {
    touchEvent.preventDefault();
    this.createEvent(touchEvent.touches[0]);
  }

  private createEvent({ clientX, clientY }: {
    clientX: number,
    clientY: number
  }) {
    const day = this.getDay(clientX);
    this.resizeStartDate = this.getDate(day, clientY);

    // Start hour must not be 24h
    if (this.resizeStartDate.getDate() > day.getDate()) {
      this.resizeStartDate = moment(this.resizeStartDate)
        .subtract(this.step, 'minutes')
        .toDate();
    }

    const endDate = moment(this.resizeStartDate)
      .add(this.step, 'minutes')
      .toDate();
    this.resizingEvent = new Event(this.resizeStartDate, endDate);
    this.events.push(this.resizingEvent);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(mouseEvent: MouseEvent) {
    if (mouseEvent.button !== 0) {
      return;
    }
    mouseEvent.preventDefault();
    this.updateEvent(mouseEvent);
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(touchEvent: TouchEvent) {
    this.updateEvent(touchEvent.touches[0]);
  }

  private updateEvent(uiEvent: MouseEvent | Touch) {
    if (this.resizingEvent) {
      this.resizeEvent(uiEvent);
    } else if (this.movingEvent) {
      this.moveEvent(uiEvent);
    }
  }

  private resizeEvent({ clientX, clientY }: {
    clientX: number,
    clientY: number
  }) {
    const day = moment(this.resizingEvent.startDate)
      .startOf('day')
      .toDate();
    const date = this.getDate(day, clientY);
    if (this.resizeStartDate && date <= this.resizeStartDate) {
      this.resizingEvent.startDate = date;
    } else if (this.resizeStartDate || date > this.resizingEvent.startDate) {
      this.resizingEvent.endDate = date;
    }
  }

  private moveEvent({ clientX, clientY }: {
    clientX: number,
    clientY: number
  }) {
    if (!this.movingEvent) {
      return;
    }
    const diff = moment(this.movingEvent.endDate)
      .diff(this.movingEvent.startDate, 'minutes');
    const day = this.getDay(clientX);
    let startDate = this.getDate(day, clientY - this.moveOffset);
    let endDate = moment(startDate)
      .add(diff, 'minutes')
      .toDate();
    if (endDate.getDate() > day.getDate()) {
      endDate = moment(day)
        .add(1, 'day')
        .toDate();
      startDate = moment(endDate)
        .subtract(diff, 'minutes')
        .toDate();
    }
    this.movingEvent.startDate = startDate;
    this.movingEvent.endDate = endDate;
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onMoveEnd() {
    if (this.resizingEvent) {
      this.resizingEvent = undefined;
      this.resizeStartDate = undefined;
    } else if (this.movingEvent) {
      this.movingEvent = undefined;
      this.moveOffset = undefined;
    }
  }

  private getDay(clientX: number): Date {
    const container: HTMLElement = this.eventsContainer.nativeElement;
    const rect = container.getBoundingClientRect();
    const max = rect.right - rect.left;
    const x = clientX - rect.left;
    let idx = Math.floor(7 * x / max);
    if (idx < 0) {
      idx = 0;
    } else if (idx > 6) {
      idx = 6;
    }
    return this.days[idx];
  }

  private getDate(day: Date, clientY: number): Date {
    const container: HTMLElement = this.eventsContainer.nativeElement;
    const rect = container.getBoundingClientRect();
    const max = rect.bottom - rect.top;
    const y = clientY - rect.top;
    let minutes = Event.minutesPerDay * y / max;
    minutes = Math.round(minutes / this.step) * this.step;
    if (minutes < 0) {
      minutes = 0;
    } else if (minutes > Event.minutesPerDay) {
      minutes = Event.minutesPerDay;
    }
    return moment(day)
      .minutes(minutes)
      .toDate();
  }
}
