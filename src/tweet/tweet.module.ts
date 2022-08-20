import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import {TweetController} from './tweet.controller'
import { Tweet } from "./tweet.model";
import { TweetService } from "./tweet.service";


@Module({
    controllers :[TweetController]
    ,providers :[TweetService],
    imports : [SequelizeModule.forFeature([Tweet])]
})

export class TweetModule{}