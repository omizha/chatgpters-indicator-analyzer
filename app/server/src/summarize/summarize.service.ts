import { BadRequestException, Injectable } from '@nestjs/common';
import { loadSummarizationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChainValues } from 'langchain/dist/schema';
import { Document } from 'langchain/document';
import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer';
import { PromptTemplate } from 'langchain/prompts';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { CustomerWebBaseLoader } from './helpers/customerWebBaseLoader';
import { isChatGPTersUrl, isYouTubeUrl } from './helpers/urlValidation';
import { YoutubeTranscriptLoader } from './helpers/youtubeTranscriptLoader';

@Injectable()
export class SummarizeService {
  /**
   *  웹 페이지를 스크래핑합니다.
   * @param url 웹 페이지 주소
   * @returns 문서
   * @see https://js.langchain.com/docs/modules/indexes/document_loaders/examples/web_loaders/web_puppeteer
   */
  async scrapper(url: string): Promise<Document[]> {
    if (!url) throw new BadRequestException('url is required');

    if (isYouTubeUrl(url)) {
      return new YoutubeTranscriptLoader(url).load();
    }

    if (isChatGPTersUrl(url)) {
      return new PuppeteerWebBaseLoader(url, {
        async evaluate(page): Promise<string> {
          page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
          await page.waitForSelector('.main');
          await page.waitForSelector('.skeleton-loader', { hidden: true });
          return page.evaluate(() =>
            document.body
              .querySelector('.main')
              .textContent?.replace(/(?<!\n\s)\n(?!\s\n)|(\n\s*\n)|(\s{2,})/g, '')
              .trim(),
          );
        },
        gotoOptions: {
          waitUntil: 'domcontentloaded',
        },
        launchOptions: {
          headless: 'new',
        },
      }).load();
    }

    // TODO: 네이버 블로그를 스크래핑 못하는 문제가 있음
    const loader = new CustomerWebBaseLoader(url);
    const docs = await loader.load();
    return docs;
  }

  /**
   * 문서를 요약합니다.
   * @param docs 문서
   * @returns 요약된 문서
   * @see https://js.langchain.com/docs/modules/chains/other_chains/summarization
   */
  async summarize(docs: Document[]): Promise<ChainValues> {
    const model = new ChatOpenAI({ temperature: 0 });
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkOverlap: 200,
      chunkSize: 1000,
    });
    const splittedDocs = await textSplitter.splitDocuments(docs);
    const combineMapPrompt = PromptTemplate.fromTemplate(`Write a concise summary of the following:

    "{text}"
    
    CONCISE SUMMARY:`);
    const combinePrompt = PromptTemplate.fromTemplate(`**Instructions** :
    - You are an expert assistant that summarizes text into **Korean language**.
    - Your task is to summarize the **text** sentences in **Korean language**.
    - Your summaries should include the following :
        - Omit duplicate content, but increase the summary weight of duplicate content.
        - Summarize by emphasizing concepts and arguments rather than case evidence.
        - Summarize in 3 lines.
        - Use the format of a bullet point.
    
    **text**
    {text}`);
    const chain = loadSummarizationChain(model, {
      combineMapPrompt,
      combinePrompt,
      returnIntermediateSteps: true,
      type: 'map_reduce',
      verbose: process.env.NODE_ENV === 'development',
    });
    const results = await chain.call({
      input_documents: splittedDocs,
    });
    return results;
  }

  /**
   * 웹 페이지를 스크래핑하고 문서를 요약합니다.
   * @param url 웹 페이지 주소
   * @returns 요약된 문서
   */
  async summarizeUrl(url: string): Promise<ChainValues> {
    const docs = await this.scrapper(url);
    const summary = await this.summarize(docs);
    return {
      docs: docs?.[0],
      summary,
    };
  }
}
