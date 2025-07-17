import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('consume-urls')
  consumeUrls(urls: string[]): { successfully_recieved: number } {
    // Simulate consuming URLs and returning the count
    return this.appService.consumeUrls(urls);
  }

  @Get('latest-urls-content')
  getLatestURLsContent(): { total_content_size: number; urls: string[] } {
    // Simulate fetching the latest URLs content
    return this.appService.getLatestURLsContent();
  }
}
