import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { TweetsService } from "./Tweets.service";


@Controller('tweets')
export class PostController{

    constructor(private readonly TweetService : TweetsService){}

    @Post()
    async addTweets(@Body('content')tweetContent : string , @Body('author') TweetAuthor : string){
        return this.TweetService.addTweet(tweetContent , TweetAuthor)
    }

    @Get()
    async getAll(){
        return this.TweetService.getAllTweets()
    }
    @Get(':id')
    async getOne(@Param('id') TweetId :number){
        return this.TweetService.GetATweet(TweetId)
    }
    @Patch(':id')
    async updateOne(@Param('id') TweetId : number , @Body('content') TweetContent){
        return this.TweetService.UpdateATweet(TweetId,TweetContent)
    }
    @Delete(':id')
    async deleteOne(@Param('id') TweetId:number ){
        return this.TweetService.DeleteATweet(TweetId)
    }
}