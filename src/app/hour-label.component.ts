import { Component, Input } from '@angular/core';

@Component({
  selector: 'scheduler-hour-label',
  templateUrl: './hour-label.component.html',
  styleUrls: ['./hour-label.component.scss']
})
export class HourLabelComponent {
  @Input() hour: number;
}
