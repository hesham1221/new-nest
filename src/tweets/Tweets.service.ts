import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuthorService } from 'src/author/author.service';
import { Author } from 'src/author/entities/author.entity';
import { CreateTweetInput } from './dto/create-tweet-input';
import { UpdateATweet } from './dto/update-tweet-input';
import { Tweet } from './Tweet.model';

@Injectable()
export class TweetsService {
  constructor(
    @InjectModel(Tweet) private TweetModel: typeof Tweet,
    private authorService: AuthorService,
  ) {}

  async getAllTweets(): Promise<Tweet[]> {
    try {
      return await this.TweetModel.findAll({ include: [Author] });
    } catch (error) {
      throw new Error(error);
    }
  }
  async addTweet(createTweetInput: CreateTweetInput , context): Promise<Tweet> {
    const { content } = createTweetInput;
    try {
      const res = await this.TweetModel.create(
        { content ,authorId : context.user.id},
        { include: [Author] },
      );
      return res;
    } catch (error) {
      throw new Error(error);
    }
  }

  async GetMyTweets(context) {
    try {
      const Tweets = this.TweetModel.findAll({where : {authorId : context.user.id}})

      return Tweets
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async author(id: number) {
    try {
      return this.authorService.findOne(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  async DeleteATweet(id: number , context) {
    try {
      await this.TweetModel.destroy({ where: { id } });
      return { message: 'deleted successfully' };
    } catch (error) {
      throw new Error(error);
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
