import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PostController } from "./Tweet.controller";
import { Tweet } from "./Tweet.model";
import { TweetsService } from "./Tweets.service";


@Module({
    controllers :[PostController]
    ,providers :[TweetsService],
    imports : [SequelizeModule.forFeature([Tweet])]
})

export class TweetModule{}