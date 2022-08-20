import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Tweet as TweetSchema } from "./tweet.model";

@Injectable()
export class TweetService {
    constructor(@InjectModel(TweetSchema) private tweetModel : typeof TweetSchema ){}

    async getAllTweets():Promise<TweetSchema[]>{
        const allTweets = await this.tweetModel.findAll()
        return allTweets
    }
   async getATweet(id:string):Promise<TweetSchema>{
    try {
        const tweet = await this.tweetModel.findOne({where : {id}})
        return tweet
    } catch (error) {
        throw new NotFoundException({message : error.message})
    }
    }

    async addAtweet(content:string , author :string){
        try {
            const new_tweet = await this.tweetModel.create({content , author})
            return new_tweet
        } catch (error) {
         throw new Error(error.message)   
        }
    }

    async deleteATweet(id:string){
        try {
            this.tweetModel.destroy({where : {id}})
            return {message : 'destroyed successfully'}
        } catch (error) {
            throw new Error('can\'t delete this tweet')
        }
    }
   async updateATweet(id:string , content :string){
    try {
        const newTweet = await this.tweetModel.update({content},{where : {id}})
        return newTweet
    } catch (error) {
        throw new Error('can\'t update this tweet')
    }
    }
}