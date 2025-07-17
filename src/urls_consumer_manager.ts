// A class to manage URL consumption and retrieval of their content
import { Injectable } from '@nestjs/common';
import { PageContent, UrlConsumer } from './url_consumer';

export interface Job {
    jobId: string;
    urls: string[];
    status: 'pending' | 'completed' | 'failed';
    results?: PageContent[]; // Optional results if the job succeeds
    error?: string; // Optional error message if the job fails
}

@Injectable()
export class UrlsConsumerManager {
    constructor(private readonly urlConsumer: UrlConsumer) {}

    // this acts as a job store, it could be replaced with a database or other persistent storage
    // to persist jobs across application restarts
    private activeJobs: Map<string, Job> = new Map();

    private latestStartedJobId: string | null = null;

    startConsume(urls: string[]): { successfullyRecieved: number, jobId: string } {
        const jobId = this.generateId();
        console.log(`Starting job ${jobId} for URLs:`, urls);

        // Resolve each URL's content asynchronously,
        // using promises here is critical because pulling a URL contents is an I/O operation that can take time
        Promise.all(urls.map(url => this.urlConsumer.fetchPageContent(url))).then((results) => {
            this.onJobComplete(jobId, results);
        }).catch(error => { 
            this.onJobFailed(jobId, error);
        });

        const job: Job = {
            jobId,
            urls,
            status: 'pending',
        };

        // Store the job in the active jobs map
        this.activeJobs.set(jobId, job);

        // Update the latest started job ID only if the job is successfully started
        this.latestStartedJobId = jobId;
        return { successfullyRecieved: urls.length, jobId: jobId };
    }

    getJob(jobId: string): Job {
        const job = this.activeJobs.get(jobId);
        if (!job) {
            throw new Error(`Job with ID ${jobId} not found.`);
        }
        return job;
    }

    getLatestJob(): Job {
        if (!this.latestStartedJobId) {
            throw new Error('No job has been started yet.');
        }
        const job = this.activeJobs.get(this.latestStartedJobId);
        if (!job) {
            throw new Error(`Latest job with ID ${this.latestStartedJobId} not found.`);
        }
        return job;
    }
     
    private generateId() {
        return Math.random().toString(36).substring(2, 15);
    }

    private onJobComplete(jobId: string, results: PageContent[]): void {
        const job = this.activeJobs.get(jobId);
        const results_as_string: string[] = results.map(result => result.toString());
        console.log(`Job ${jobId} completed successfully with results:`, results_as_string);
        if (job) {
            job.status = 'completed';
            job.results = results;
            this.activeJobs.set(jobId, job);
        }
    }

    private onJobFailed(jobId: string, error: Error): void {
        // Gracefully handle the error, report it and then update the job status
        const job = this.activeJobs.get(jobId);
        console.error(`Job ${jobId} failed with error:`, error.message);
        if (job) {
            job.status = 'failed';
            job.error = error.message;
            this.activeJobs.set(jobId, job);
        }
    }
}