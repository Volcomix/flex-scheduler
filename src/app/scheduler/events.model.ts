import { Event } from './event.model';

export interface Events {
  [timeInMillis: number]: Event[];
}
