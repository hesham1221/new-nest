import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthorModule } from "src/author/author.module";
import { TweetController } from "./Tweet.controller";
import { Tweet } from "./Tweet.model";
import { TweetsResolver } from "./Tweets.resolver";
import { TweetsService } from "./Tweets.service";


@Module({
    controllers : [TweetController],
    providers :[TweetsService , TweetsResolver],
    imports : [SequelizeModule.forFeature([Tweet]) , AuthorModule]
})

export class TweetModule{}