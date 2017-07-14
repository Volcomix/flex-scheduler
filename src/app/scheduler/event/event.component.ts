import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  HostListener,
  HostBinding
} from '@angular/core';

import * as moment from 'moment';

import { Event } from '../event.model';

const halfDayPercent = 50 / 7;

@Component({
  selector: 'scheduler-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  @Input() event: Event;
  @Output() resize = new EventEmitter<void>();
  @Output() move = new EventEmitter<number>();

  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  private get weekDay() {
    return moment(this.event.startDate).weekday();
  }

  @HostBinding('style.top.%') get top() {
    return this.toPercent(this.event.startDate);
  }

  @HostBinding('style.bottom.%') get bottom() {
    // End hour cannot be 0h, so replace it with 24h
    return 100 - (this.toPercent(this.event.endDate) || 100);
  }

  @HostBinding('style.left.%') get left() {
    return 100 * this.weekDay / 7;
  }

  @HostBinding('style.right.%') get right() {
    return 100 * (1 - (this.weekDay + 1) / 7) + halfDayPercent;
  }

  @HostBinding('class.compact') get isCompact() {
    const startDate = moment(this.event.startDate);
    const endDate = moment(this.event.endDate);
    const duration = endDate.diff(startDate, 'minutes');
    return duration < 60;
  }

  private toPercent(date: Date) {
    const hours = date.getHours();
    const minutes = hours * 60 + date.getMinutes();
    return 100 * minutes / Event.minutesPerDay;
  }

  resizeEvent(mouseEvent: MouseEvent) {
    if (mouseEvent.button) { // Accept left mouse button and touch only
      return;
    }
    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();
    this.resize.emit();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(mouseEvent: MouseEvent) {
    if (mouseEvent.button !== 0) {
      return;
    }
    mouseEvent.stopPropagation();
    const offset = this.getOffset(mouseEvent.clientY);
    this.move.emit(offset);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(touchEvent: TouchEvent) {
    touchEvent.preventDefault();
    touchEvent.stopPropagation();
    const offset = this.getOffset(touchEvent.touches[0].clientY);
    this.move.emit(offset);
  }

  private getOffset(clientY: number) {
    const rect = this.el.getBoundingClientRect();
    return clientY - rect.top;
  }
}
