import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { Tweet } from "./tweet.model";
import { TweetService } from "./tweet.service";


@Controller('tweets')
export class TweetController{
    constructor(private readonly TweetService : TweetService){}
    @Get()
   async getAllTweets():Promise<Tweet[]>{
       const all_Tweets= await this.TweetService.getAllTweets()
       return all_Tweets
    }
    @Get(':id')
   async getAtweet(@Param('id') tweetId :string):Promise<Tweet>{
        return await this.TweetService.getATweet(tweetId)
    }
    @Post()
    async addATweet(@Body('content') tweetContent :string , @Body('author') TweetAuthor:string){
        return await this.TweetService.addAtweet(tweetContent,TweetAuthor)
    }
    @Delete(':id')
    async deleteATweet(@Param('id') tweetId :string){
        return await this.TweetService.deleteATweet(tweetId)
    }
    @Patch(':id')
    async updateATweet(@Param('id') tweetId:string , @Body('content') TweetContent : string){
        return await this.TweetService.updateATweet(tweetId , TweetContent)
    }
}