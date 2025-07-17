import { Body, Param, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('consume-urls')
  consumeUrls(@Body('urls') urls: string[]): { message: string, successfuly_recieved: number, job_id: string } {
    const { successfullyRecieved, jobId } = this.appService.consumeUrls(urls);
    return { message: `Successfully started job ${jobId} to process ${successfullyRecieved} URLs`, successfuly_recieved: successfullyRecieved, job_id: jobId };
  }

  @Get('urls-content/:jobId')
  getUrlsContent(@Param('jobId') jobId: string): { message: string, job_data: { urls: string[], status: string, total_content_size?: number, error?: string } } {
    const jobData = this.appService.getJob(jobId);
    if (!jobData) {
      throw new Error(`Job with ID ${jobId} not found.`);
    }
    return { message: this.jobToMessage(jobData), job_data: jobData }
  }

  @Get('latest-urls-content')
  getLatestURLsContent(): { message: string, job_data: { urls: string[], status: string, total_content_size?: number, error?: string } } {
    const jobData = this.appService.getLatestURLsContent();
    return { message: this.jobToMessage(jobData), job_data: jobData }
  }

  private jobToMessage(job: { jobId: string, urls: string[], status: string, total_content_size?: number, error?: string }): string {
    if (job.status === 'failed') {
      return `FAILURE: Job (job id: ${job.jobId}) was not successful, error: ${job.error}`;
    } else if (job.status === 'pending') {
      return `PENDING: Job (job id: ${job.jobId}) is still in progress, please check back later.`;
    }
    return `SUCCESS: Job (job id: ${job.jobId}) was successful, total content size is ${job.total_content_size}`;
  }
}
