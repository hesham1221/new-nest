import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TweetModule } from './tweets/Tweets.module';
@Module({
  imports: [SequelizeModule.forRoot({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'tweets',
    autoLoadModels : true,
    synchronize : true,
  }),
  TweetModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}