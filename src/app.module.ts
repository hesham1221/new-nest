import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TweetModule} from './tweet/tweet.module'
import { SequelizeModule } from '@nestjs/sequelize';
import { Tweet } from './tweet/tweet.model';
@Module({
  imports: [SequelizeModule.forRoot({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'tweets',
    models: [Tweet],
  }),TweetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}