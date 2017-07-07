import { browser, by, element } from 'protractor';

export class SchedulerPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('scheduler-root h1')).getText();
  }
}
