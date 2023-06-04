import { Injectable } from '@nestjs/common';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { Document } from 'langchain/document';

@Injectable()
export class SummarizeService {
  async scrapper(url: string): Promise<Document[]> {
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();
    return docs;
  }
}
