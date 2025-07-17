import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlConsumer } from './url_consumer';
import { UrlsConsumerManager } from './urls_consumer_manager';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, UrlConsumer, UrlsConsumerManager],
})
export class AppModule {}
