// a class to consume a given URL and return the content
import { Injectable } from '@nestjs/common';
import axios, { AxiosResponseHeaders } from 'axios';

export class PageContent {
    url: string;
    content: string;
    status: number;
    content_type: string;
    content_encoding: string;
    content_length: number;

    constructor(
        url: string,
        content: string,
        status: number,
        content_type: string,
        content_encoding: string,
        content_length: number
    ) {
        this.url = url;
        this.content = content;
        this.status = status;
        this.content_type = content_type;
        this.content_encoding = content_encoding;
        this.content_length = content_length;
    }

    toString(): string {
        return `URL: ${this.url}, Status: ${this.status}, Content-Type: ${this.content_type}, Content-Encoding: ${this.content_encoding}, Content-Length: ${this.content_length}, Content: ${this.content.substring(0, 100)}...`;
    }
}

@Injectable()
export class UrlConsumer {

    private FETCH_TIMEOUT = 1000; // 1 second

    async fetchPageContent(url: string): Promise<PageContent> {
        const response = await axios.get(url, {timeout: this.FETCH_TIMEOUT});
        const contentLength = response.data.length;
        // possible improvement: handle cases where content is too large
        return new PageContent(
            url,
            response.data,
            response.status,
            response.headers['content-type'] || '',
            response.headers['content-encoding'] || '',
            contentLength
        );
    }
}