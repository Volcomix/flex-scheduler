import { Event } from './event';

export interface Events {
  [timeInMillis: number]: Event[];
}
