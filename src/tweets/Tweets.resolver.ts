
import { Args, Field, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Author } from "src/author/entities/author.entity";
import { CreateTweetInput } from "./dto/create-tweet-input";
import { getATweetDto } from "./dto/getATweet.dto";
import { UpdateATweet } from "./dto/update-tweet-input";
import { Message, Tweet } from "./Tweet.model";
import { TweetsService } from "./Tweets.service";

@Resolver(() => Tweet)
export class TweetsResolver {
    constructor(private TweetsService : TweetsService){}


    @Query(() => [Tweet])
    tweet():Promise<Tweet[]>{
        return this.TweetsService.getAllTweets()
    }

    @Query(() => Tweet)
    getATweet(@Args('getATweet') getAtweet : getATweetDto):Promise<Tweet>{
        return this.TweetsService.GetATweet(getAtweet.id)
    }
    
    @ResolveField(() => Author)
    author(@Parent() tweet : Tweet):Promise<Author>{
        return this.TweetsService.author(tweet.authorId)
    }

    @Mutation(() => Tweet)
    updateATweet(@Args('updateATweet') updateATweet : UpdateATweet):Promise<Tweet>{
        return this.TweetsService.UpdateATweet(updateATweet)
    }
    @Mutation(() => Message)
    DeleteATweet(@Args('deleteATweet') deleteATweet : getATweetDto):Promise<Message>{
        return this.TweetsService.DeleteATweet(deleteATweet.id)
    }
    
    @Mutation(() => Tweet )
    createATweet(@Args('createTweetInput') createTweetInput : CreateTweetInput):Promise<Tweet>{
        return this.TweetsService.addTweet(createTweetInput)
    }
}
