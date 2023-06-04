import { Test, TestingModule } from '@nestjs/testing';
import { Document } from 'langchain/document';
import { SummarizeService } from './summarize.service';

describe('SummarizeService', () => {
  let service: SummarizeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SummarizeService],
    }).compile();

    service = module.get<SummarizeService>(SummarizeService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should scrapper', async () => {
    jest.spyOn(await import('langchain/document_loaders/web/cheerio'), 'CheerioWebBaseLoader').mockImplementation(
      jest.fn().mockImplementation(() => ({
        load: jest.fn().mockResolvedValue([
          new Document({
            pageContent: '<html><head><title>Google</title></head><body><h1>Google</h1></body></html>',
          }),
        ]),
      })),
    );
    const url = 'https://www.google.com';
    const result = await service.scrapper(url);
    expect(result).toBeDefined();
    expect(result?.length).toBeGreaterThan(0);
    expect(result[0].pageContent).toContain('Google');
  });
});
