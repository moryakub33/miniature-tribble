import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlConsumer } from './url_consumer';
import { UrlsConsumerManager } from './urls_consumer_manager';
import e from 'express';

describe('AppController', () => {
  let appController: AppController;

  const mockUrlConsumer = {
    fetchPageContent: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        UrlsConsumerManager,
        {
          provide: UrlConsumer,
          useValue: mockUrlConsumer,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('consume URLs', () => {
    it('should return the number of URLs successfully recieved', () => {
      mockUrlConsumer.fetchPageContent.mockResolvedValue('Page content');
      const urls = ['http://example.com', 'http://test.com'];
      expect(appController.consumeUrls(urls)).toEqual({ successfuly_recieved: 2, job_id: expect.any(String), message: expect.stringContaining('Successfully started job') });

      // expect that each URL was fetched using the mockUrlConsumer
      expect(mockUrlConsumer.fetchPageContent).toHaveBeenCalledWith('http://example.com');
      expect(mockUrlConsumer.fetchPageContent).toHaveBeenCalledWith('http://test.com');
    });
  });

  describe('get latest URLs content', () => {
    it('should expect an exception to be thrown because no job has started yet', () => {
      expect(() => appController.getLatestURLsContent()).toThrow('No job has been started yet.');
    });
  });
});
