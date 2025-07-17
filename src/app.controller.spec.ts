import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
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
      const urls = ['http://example.com', 'http://test.com'];
      expect(appController.consumeUrls(urls)).toEqual({ successfully_recieved: 2});
    });
  });

  describe('get latest URLs content', () => {
    it('should return the number of URLs successfully recieved', () => {
      expect(appController.getLatestURLsContent()).toEqual({ total_content_size: 0, urls: []});
    });
  });
});
