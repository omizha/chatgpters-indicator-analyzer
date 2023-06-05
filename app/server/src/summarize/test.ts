import { PlaywrightWebBaseLoader } from 'langchain/document_loaders/web/playwright';
import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';

const naver = 'https://blog.naver.com/hloveh01/223118091756';
const tistory = 'https://a.humanityk.com/148';

/**
 * Loader uses `page.content()`
 * as default evaluate function
 **/
const loader1 = new PuppeteerWebBaseLoader(tistory, {
  gotoOptions: {
    waitUntil: 'domcontentloaded',
  },
  launchOptions: {
    headless: true,
  },
  /** Pass custom evaluate, in this case you get page and browser instances */
  async evaluate(page, browser) {
    if (page.url().startsWith('https://blog.naver.com')) {
      const result = await page.evaluate(() => {
        console.log(0, document.querySelector('#mainFrame'));
        return document.querySelector('#mainFrame').ownerDocument.querySelector('body').innerHTML;
        // return document.body.innerHTML;
      });
      console.log('naver blog', result);
      return result; //document.querySelector('#mainFrame'); //?.contentWindow.document.querySelector('body').innerHTML;
    }
    //   await page.waitForResponse('https://www.tabnews.com.br/va/view');
    //   const result = await page.evaluate(() => document.body.innerHTML);
    //   return result;
    return page.content();
  },
});
// loader1.load().then((docs) => console.log(1, docs));

// const loader2 = new PlaywrightWebBaseLoader('https://blog.naver.com/hloveh01/223118091756');
// loader2.load().then((docs) => console.log(2, docs));

// const loader3 = new CheerioWebBaseLoader(tistory, {
//   selector: 'article',
// });
// loader3.load().then((docs) => console.log(3, docs[0].pageContent));
