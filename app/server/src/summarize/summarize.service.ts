import { Injectable } from '@nestjs/common';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { Document } from 'langchain/document';

@Injectable()
export class SummarizeService {
  async scrapper(url: string): Promise<Document[]> {
    // TODO: 네이버 블로그를 스크래핑 못하는 문제가 있음
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();
    return docs;
  }
}
