import { SchedulerPage } from './app.po';

describe('scheduler App', () => {
  let page: SchedulerPage;

  beforeEach(() => {
    page = new SchedulerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to scheduler!!');
  });
});
