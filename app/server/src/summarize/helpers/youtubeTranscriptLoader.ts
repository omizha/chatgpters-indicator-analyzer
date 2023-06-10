import { Document } from 'langchain/document';
import { BaseDocumentLoader, DocumentLoader } from 'langchain/document_loaders';
import { YoutubeTranscript } from 'youtube-transcript';

export class YoutubeTranscriptLoader extends BaseDocumentLoader implements DocumentLoader {
  timeout = 10000;

  constructor(public webPath: string) {
    super();
  }

  async scrape(): Promise<string> {
    const transcripts = await YoutubeTranscript.fetchTranscript(this.webPath);
    return transcripts.map(({ text }) => text).join(' ');
  }

  async load(): Promise<Document[]> {
    const pageContent = await this.scrape();
    return [new Document({ metadata: { provider: 'youtube', source: this.webPath }, pageContent })];
  }
}
