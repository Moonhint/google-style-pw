import { GoogleStylePwPage } from './app.po';

describe('google-style-pw App', () => {
  let page: GoogleStylePwPage;

  beforeEach(() => {
    page = new GoogleStylePwPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
