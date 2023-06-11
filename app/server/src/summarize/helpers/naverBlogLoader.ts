import * as cheerio from 'cheerio';
import { Document } from 'langchain/document';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { USER_AGENT_MOBILE } from './constants';
import { stripHtmlAndNewLineAndExtraSpace } from './stringHelper';

export class NaverBlogLoader extends CheerioWebBaseLoader {
  constructor(webPath: string) {
    super(webPath);
  }

  getMobileUrl(url: string): string {
    if (this.webPath.startsWith('https://blog.naver.com')) {
      const matched = /\/(?<blogId>[a-zA-Z0-9_-]+)\/(?<logNo>\d+)\/?/.exec(url);
      if (matched && matched.groups) {
        const { blogId, logNo } = matched.groups;
        return `https://m.blog.naver.com/PostView.naver?blogId=${blogId}&logNo=${logNo}`;
      }
    }
    return url;
  }

  async scrape(): Promise<cheerio.CheerioAPI> {
    const url = this.getMobileUrl(this.webPath);
    const response = await this.caller.call(fetch, url, {
      headers: {
        'User-Agent': USER_AGENT_MOBILE,
      },
      signal: this.timeout ? AbortSignal.timeout(this.timeout) : undefined,
    });
    const html = await response.text();
    return cheerio.load(html);
  }

  async scrapeWebArticle(): Promise<string> {
    const $ = await this.scrape();
    let text = $('._postView').text();
    if (!text.trim()) {
      text = $('body').text();
    }
    return stripHtmlAndNewLineAndExtraSpace(text);
  }

  async load(): Promise<Document[]> {
    const pageContent = await this.scrapeWebArticle();
    return [new Document({ metadata: { source: this.webPath }, pageContent })];
  }
}
