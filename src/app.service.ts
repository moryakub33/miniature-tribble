import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  consumeUrls(urls: string[]): { successfully_recieved: number } {
    // Simulate consuming URLs and returning the count
    return {successfully_recieved: urls.length};
  }

  getLatestURLsContent(): { total_content_size: number; urls: string[] } {
    // Simulate fetching the latest URLs content
    return { total_content_size: 0, urls: [] };
  }
}
