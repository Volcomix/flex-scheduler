export class Event {
  static minutesPerDay = 24 * 60;

  constructor(
    public startDate: Date,
    public endDate: Date
  ) { }
}
