import * as cheerio from 'cheerio';
import { Document } from 'langchain/document';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';

export class CustomerWebBaseLoader extends CheerioWebBaseLoader {
  constructor(webPath: string) {
    super(webPath);
  }

  async scrape(): Promise<cheerio.CheerioAPI> {
    const response = await this.caller.call(fetch, this.webPath, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (iPhone14,3; U; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/19A346 Safari/602.1',
      },
      signal: this.timeout ? AbortSignal.timeout(this.timeout) : undefined,
    });
    const html = await response.text();
    return cheerio.load(html);
  }

  async scrapeWebArticle(): Promise<string> {
    const $ = await this.scrape();
    let text = $('article').text();
    if (!text.trim()) {
      text = $('main').text();
    }
    if (!text.trim()) {
      text = $('body').text();
    }
    return text;
  }

  async load(): Promise<Document[]> {
    const pageContent = await this.scrapeWebArticle();
    return [new Document({ metadata: { source: this.webPath }, pageContent })];
  }
}
