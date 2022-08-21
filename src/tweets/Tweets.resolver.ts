
import { Query } from "@nestjs/graphql";
import { Tweet } from "./Tweet.model";
import { TweetsService } from "./Tweets.service";


export class TweetsResolver {
    constructor(private TweetsService : TweetsService){}

    @Query(() => Tweet)
   async tweet():Promise<Tweet[]>{
        return await this.TweetsService.getAllTweets()
    }
}