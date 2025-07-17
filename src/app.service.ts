import { Injectable } from '@nestjs/common';

import { UrlsConsumerManager, Job } from './urls_consumer_manager';

@Injectable()
export class AppService {
  constructor(private readonly UrlConsumerManager: UrlsConsumerManager) {}

  getHello(): string {
    return 'Hello World!';
  }

  consumeUrls(urls: string[]): { successfullyRecieved: number, jobId: string } {
    if (!urls || urls.length === 0) {
      throw new Error('No URLs provided to consume.');
    }

    console.log(`Got ${urls}`);

    return this.UrlConsumerManager.startConsume(urls)
  }

  getJob(jobId: string): { jobId: string, urls: string[], status: string, total_content_size?: number, error?: string } {
    const job = this.UrlConsumerManager.getJob(jobId);
    if (!job) {
      throw new Error(`Job with ID ${jobId} not found.`);
    }
    return this.jobToResponse(job);
  }

  getLatestURLsContent(): { jobId: string, urls: string[], status: string, total_content_size?: number, error?: string } {
    const latestJob = this.UrlConsumerManager.getLatestJob();
    if (!latestJob) {
      throw new Error('No job has been started yet.');
    }
    return this.jobToResponse(latestJob);
  }

  private jobToResponse(job: Job): { jobId: string, urls: string[], status: string, total_content_size?: number, error?: string } {
    const result = { jobId: job.jobId, urls: job.urls, status: job.status };
    if (job.status === 'completed' && job.results) {
      const totalContentSize = job.results.reduce((acc, content) => acc + content.content.length, 0);
      return { ...result, total_content_size: totalContentSize };
    } else if (job.status === 'failed') {
      return {...result, error: job.error };
    }
    return result; 
  }
}
