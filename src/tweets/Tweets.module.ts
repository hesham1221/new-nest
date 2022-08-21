import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Tweet } from "./Tweet.model";
import { TweetsResolver } from "./Tweets.resolver";
import { TweetsService } from "./Tweets.service";


@Module({
    providers :[TweetsService , TweetsResolver],
    imports : [SequelizeModule.forFeature([Tweet])]
})

export class TweetModule{}