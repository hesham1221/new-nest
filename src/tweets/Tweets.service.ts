import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { AuthorService } from 'src/author/author.service';
import { Author } from 'src/author/entities/author.entity';
import { CreateTweetInput } from './dto/create-tweet-input';
import { UpdateATweet } from './dto/update-tweet-input';
import { GetAllTweetInput, Tweet } from './Tweet.model';

@Injectable()
export class TweetsService {
  constructor(
    @InjectModel(Tweet) private TweetModel: typeof Tweet,
    private authorService: AuthorService,
  ) {} 

  async getAllTweets(): Promise<Tweet[]> {
    try {
      return await this.TweetModel.findAll()
    } catch (error) {
      throw new Error(error);
    }
  }
  async addTweet(createTweetInput: CreateTweetInput , context): Promise<Tweet> {
    const { content } = createTweetInput;
    try {
      const res = await this.TweetModel.create(
        { content ,authorId : context.author.id},
        { include: [Author] },
      );
      return res;
    } catch (error) {
      throw new Error(error);
    }
  }

  async GetMyTweets(context) {
    try {
      const Tweets = this.TweetModel.findAll({where : {authorId : context.author.id}})

      return Tweets
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async author(id: number) {
    try {
      return await this.authorService.findOne(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  async likers(tweetId : number){
    try {
      const likers = await this.authorService.findLikers(tweetId)
      return likers
    } catch (error) {
      throw new Error(error)
    }
  }

  async DeleteATweet(id: number , context) {
    const tweet = await this.TweetModel.findOne({where : {id}})
    if(!tweet){
      throw new NotFoundException
    }
    if (tweet.authorId === context.author.id){
      try {
        await this.TweetModel.destroy({ where: { id } });
        return { message: 'deleted successfully' };
      } catch (error) {
        throw new Error(error);
      }
    }
    else{
      throw new UnauthorizedException
    }
  }

  async UpdateATweet(updateATweet: UpdateATweet) {
    const { id, content } = updateATweet;
    try {
      await this.TweetModel.update({ content }, { where: { id } });
      return this.TweetModel.findOne({ where: { id }, include: [Author] });
    } catch (error) {
      throw new Error(error);
    }
  }
}
