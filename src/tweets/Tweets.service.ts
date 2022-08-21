import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Tweet } from "./Tweet.model";


@Injectable()
export class TweetsService {
    constructor(@InjectModel(Tweet) private TweetModel : typeof Tweet){}

    async getAllTweets():Promise<Tweet[]>{
        try {
            return await this.TweetModel.findAll()
            
        } catch (error) {
            throw new Error(error)
        }
    }
    async addTweet(content : string , author : string):Promise<Tweet>{
        try {
            return await this.TweetModel.create({content , author})
            
        } catch (error) {
            throw new Error(error)
        }
    }

    async GetATweet(id : number) {
        try {
            return await this.TweetModel.findOne({where : {id}})
        } catch (error) {
            throw new NotFoundException
        }
    }

    async DeleteATweet(id : number) {
        try {
            await this.TweetModel.destroy({where : {id}})
            return {message : 'deleted successfully'}
        } catch (error) {
            throw new Error(error)
        }
    }

    async UpdateATweet(id : number , content : string){
        try {
            await this.TweetModel.update({content} , {where : {id}})
            return {message : 'updated succesfully'}
        } catch (error) {
            throw new Error(error)
        }
    }
}