const minutesPerDay = 24 * 60;

export class Event {
  constructor(public startDate: Date, public endDate: Date) { }

  private toPercent(date: Date) {
    const hours = date.getHours();
    const minutes = hours * 60 + date.getMinutes();
    return 100 * minutes / minutesPerDay;
  }

  get startPercent() {
    return this.toPercent(this.startDate);
  }

  get endPercent() {
    return this.toPercent(this.endDate);
  }
}
