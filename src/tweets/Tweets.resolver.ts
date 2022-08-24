
import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Author } from "src/author/entities/author.entity";
import { AuthGuard } from "src/author/jwt.auth.guard";
import { CreateTweetInput } from "./dto/create-tweet-input";
import { getATweetDto } from "./dto/getATweet.dto";
import { UpdateATweet } from "./dto/update-tweet-input";
import { GetAllTweetInput, Message, Tweet, TweetRes } from "./Tweet.model";
import { TweetsService } from "./Tweets.service";

@Resolver(() => Tweet)
export class TweetsResolver {
    constructor(private TweetsService : TweetsService){}


    @Query(() => GetAllTweetInput )
    @UseGuards(new AuthGuard())
    tweet(@Context() context):Promise<GetAllTweetInput>{
        return this.TweetsService.getAllTweets(context)
    }

    @Query(() => [Tweet])
    @UseGuards(new AuthGuard())
    getMyTweets(@Context() context){
        return this.TweetsService.GetMyTweets(context)
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
    @UseGuards(new AuthGuard())
    DeleteATweet(@Args('deleteATweet') deleteATweet : getATweetDto , @Context() context):Promise<Message>{
        return this.TweetsService.DeleteATweet(deleteATweet.id , context)
    }
    
    @Mutation(() => Tweet )
    @UseGuards(new AuthGuard())
    createATweet(@Args('createTweetInput') createTweetInput : CreateTweetInput , @Context()context):Promise<Tweet>{
        return this.TweetsService.addTweet(createTweetInput , context)
    }
}
