import {
  Component,
  ElementRef,
  Input,
  HostListener
} from '@angular/core';

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
  movingEvent: Event;

  private el: HTMLElement;
  private startDate: Date;
  private moveOffset: number;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  startResizingEvent(event: Event) {
    this.resizingEvent = event;
  }

  startMovingEvent(event: Event, offset: number) {
    this.movingEvent = event;
    this.moveOffset = offset;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(mouseEvent: MouseEvent) {
    if (mouseEvent.button !== 0) {
      return;
    }
    this.createEvent(mouseEvent.clientY);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(touchEvent: TouchEvent) {
    touchEvent.preventDefault();
    this.createEvent(touchEvent.touches[0].clientY);
  }

  private createEvent(clientY: number) {
    this.startDate = this.getDate(clientY);

    // Start hour must not be 24h
    if (this.startDate.getDate() > this.day.getDate()) {
      this.startDate = moment(this.startDate)
        .subtract(this.step, 'minutes')
        .toDate();
    }

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
    this.updateEvent(mouseEvent.clientY);
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(touchEvent: TouchEvent) {
    this.updateEvent(touchEvent.touches[0].clientY);
  }

  private updateEvent(clientY: number) {
    if (this.resizingEvent) {
      this.resizeEvent(clientY);
    } else if (this.movingEvent) {
      this.moveEvent(clientY);
    }
  }

  private resizeEvent(clientY: number) {
    const date = this.getDate(clientY);
    if (this.startDate && date <= this.startDate) {
      this.resizingEvent.startDate = date;
    } else if (this.startDate || date > this.resizingEvent.startDate) {
      this.resizingEvent.endDate = date;
    }
  }

  private moveEvent(clientY: number) {
    if (!this.movingEvent) {
      return;
    }
    const diff = moment(this.movingEvent.endDate)
      .diff(this.movingEvent.startDate, 'minutes');
    let startDate = this.getDate(clientY - this.moveOffset);
    let endDate = moment(startDate)
      .add(diff, 'minutes')
      .toDate();
    if (endDate.getDate() > this.day.getDate()) {
      endDate = moment(this.day)
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
      this.startDate = undefined;
    } else if (this.movingEvent) {
      this.movingEvent = undefined;
      this.moveOffset = undefined;
    }
  }

  private getDate(clientY: number) {
    const rect = this.el.getBoundingClientRect();
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
