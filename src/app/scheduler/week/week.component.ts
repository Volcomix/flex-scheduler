import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  HostListener,
  HostBinding,
} from '@angular/core';

import * as moment from 'moment';

import { Events } from '../events.model';
import { Event } from '../event.model';
import { Day } from '../day.model';
import { MovingEvent } from '../day/day.component';

@Component({
  selector: 'scheduler-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent implements OnChanges {
  @Input() date: Date;
  @Input() events: Events;
  @Input() step: number;

  @ViewChild('container') container: ElementRef;

  days: Day[];
  hours: number[];

  resizingEvent: Event;
  movingEvent: Event;

  private startDate: Date;
  private moveOffset: number;

  constructor(el: ElementRef) {
    this.hours = [];
    for (let i = 0; i < 24; i++) {
      this.hours.push(i);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const date: Date = changes.date.currentValue;
    const events: Events = changes.events.currentValue;
    const hasDateChanged = date !== changes.date.previousValue;
    const hasEventsChanged = events !== changes.events.previousValue;
    if (!hasDateChanged && !hasEventsChanged) {
      return;
    }
    this.initDays(date, events);
  }

  private initDays(date: Date, events: Events) {
    this.days = [];
    for (let i = 0; i < 7; i++) {
      const day = moment(date)
        .startOf('week')
        .add(i, 'day')
        .toDate();
      events[+day] = events[+day] || [];
      this.days.push({
        date: day,
        events: events[+day]
      });
    }
  }

  @HostBinding('class.resizing') get isResizingEvent(): boolean {
    return this.resizingEvent !== undefined;
  }

  @HostBinding('class.moving') get isMoveingEvent(): boolean {
    return this.movingEvent !== undefined;
  }

  startResizingEvent(event: Event) {
    this.resizingEvent = event;
  }

  startMovingEvent(movingEvent: MovingEvent) {
    this.movingEvent = movingEvent.event;
    this.moveOffset = movingEvent.offset;
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
    this.startDate = this.getDate(day.date, clientY);

    // Start hour must not be 24h
    if (this.startDate.getDate() > day.date.getDate()) {
      this.startDate = moment(this.startDate)
        .subtract(this.step, 'minutes')
        .toDate();
    }

    const endDate = moment(this.startDate)
      .add(this.step, 'minutes')
      .toDate();
    this.resizingEvent = new Event(this.startDate, endDate);
    day.events.push(this.resizingEvent);
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
    if (this.startDate && date <= this.startDate) {
      this.resizingEvent.startDate = date;
    } else if (this.startDate || date > this.resizingEvent.startDate) {
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
    let startDate = this.getDate(day.date, clientY - this.moveOffset);
    let endDate = moment(startDate)
      .add(diff, 'minutes')
      .toDate();
    if (endDate.getDate() > day.date.getDate()) {
      endDate = moment(day.date)
        .add(1, 'day')
        .toDate();
      startDate = moment(endDate)
        .subtract(diff, 'minutes')
        .toDate();
    }
    if (startDate.getDate() !== this.movingEvent.startDate.getDate()) {
      this.moveEventToDay(day);
    }
    this.movingEvent.startDate = startDate;
    this.movingEvent.endDate = endDate;
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onMoveEnd() {
    if (this.resizingEvent) {
      this.resizingEvent = undefined;
      this.startDate = undefined;
    } else if (this.movingEvent) {
      this.movingEvent = undefined;
      this.moveOffset = undefined;
    }
  }

  private moveEventToDay(day: Day) {
    const previousDayIdx = moment(this.movingEvent.startDate).weekday();
    const previousDay = this.days[previousDayIdx];
    const eventIdx = previousDay.events.indexOf(this.movingEvent);
    this.days[previousDayIdx].events.splice(eventIdx, 1);
    day.events.push(this.movingEvent);
  }

  private getDay(clientX: number): Day {
    const container: HTMLElement = this.container.nativeElement;
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
    const container: HTMLElement = this.container.nativeElement;
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
