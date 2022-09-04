import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message, Tweet } from 'src/tweets/Tweet.model';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { Author } from './entities/author.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import * as fs from 'fs/promises'
import {
  getMyFollowersOutPut,
  MyFollowersOutPut,
} from './dto/getMyFollowers.output';
import { likers } from 'src/tweets/likers.model';
import { Follow } from './entities/following.entity';
import { findAllOutput } from './entities/finAllAuthor.output';
import { AuthMessage } from './dto/login-output';
@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author) private AuthorModel: typeof Author,
    @InjectModel(Follow) private FollowModel: typeof Follow,
    @InjectModel(likers) private likersModel : typeof likers
  ) {}


  async getProfilePhoto(context,response){
      const user = await this.AuthorModel.findOne({where : {id : context.author.id}})
      response.send()
    }

    async uploadPhoto(file){
      try {
        const { createReadStream } = file;
  
        const stream = createReadStream();
        const chunks = [];
  
        const buffer = await new Promise<Buffer>((resolve, reject) => {
          let buffer: Buffer;
  
          stream.on('data', function (chunk) {
            chunks.push(chunk);
          });
  
          stream.on('end', function () {
            buffer = Buffer.concat(chunks);
            resolve(buffer);
          });
  
          stream.on('error', reject);
        });
  
        const path = `/authors-profilePics/${Date.now()}-${file.filename}`
        await fs.writeFile(`.${path}`, buffer);
  
        return path;
      } catch (err) {
        return err;
      }
    }

  async create(createAuthorInput: CreateAuthorInput): Promise<AuthMessage> {
    const { username, password } = createAuthorInput;
    const newPassword: string = await bcrypt.hash(password, 10);
    try {
      const author =  await this.AuthorModel.create({ username, password: newPassword });
      return {
        token: jwt.sign(
          { username: author.username, id: author.id },
          process.env.SECRET,
          {
            expiresIn: '30m',
          },
        ),
        author : author,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<Author[]> {
    try {
      const users = await this.AuthorModel.findAll({ include: [Tweet] });
      return users
    } catch (error) {
      throw new Error(error);
    }
  }
  async findLikers(tweetId : number) : Promise<MyFollowersOutPut[]>{
    try{
      const likersIndexes = []
      const tweetLikers = await this.likersModel.findAll({where : {tweetId}})
      if(tweetLikers.length === 0 || !tweetLikers){
        return []
      }
      tweetLikers.forEach(liker => likersIndexes.push(liker.authorId))
      const allLikers = await this.AuthorModel.findAll({where : {id : {[Op.in] : likersIndexes} }})
      const likers: MyFollowersOutPut[] = allLikers.map((follow) => ({
        username: follow.username,
        id: follow.id,
      }));
      return likers
    }catch(err){
      throw new Error(err)
    }
  }

  async findOne(id: number): Promise<Author> {
    try {
      const countOfFollowers = await this.FollowModel.count({where : {followedId : id}})
      const countOfFollowed = await this.FollowModel.count({where : {followerId : id}})
      await this.AuthorModel.update({numFollowing : countOfFollowed , numFollowers :countOfFollowers } , {where : {id}})
      return await this.AuthorModel.findOne({ where: { id } });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async Login(loginInput: CreateAuthorInput) {
    const { username, password } = loginInput;
    try {
      const author = await this.AuthorModel.findOne({ where: { username } });
      if (author) {
        const isValid = await bcrypt.compare(password, author.password);
        if (isValid) {
          return {
            token: jwt.sign(
              { username: author.username, id: author.id },
              process.env.SECRET,
              {
                expiresIn: '30m',
              },
            ),
            author : author,
          };
        } else {
          throw UnauthorizedException;
        }
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw new NotFoundException('user not found');
    }
  }

  async valid(context){
    console.log(context)
    const author = await this.AuthorModel.findOne({where : {id : context.author.id}})
    console.log(author)
    return author
  }

  async update(updateAuthorInput: UpdateAuthorInput , context): Promise<Author> {
    const {oldPassword ,password, ...others } = updateAuthorInput;
    try {

      const user = await this.AuthorModel.findOne({where : {id : context.author.id}})

      if (await bcrypt.compare(oldPassword , user.password)){
        if(password){
          const newPassword = await bcrypt.hash(password , 10)
          await this.AuthorModel.update({password : newPassword , ...others} , {where : {id : context.author.id}});
          return await this.AuthorModel.findOne({
          where: {id : context.author.id},
        });
        }else{
          await this.AuthorModel.update({...others} , {where : {id : context.author.id}});
          return await this.AuthorModel.findOne({
            where: {id : context.author.id},
          });
        }
        
      }else {
        throw new UnauthorizedException('old password incorrect')
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(username: string): Promise<Message> {
    try {
      await this.AuthorModel.increment({numFollowers : -1} , {where : {}})
      await this.AuthorModel.destroy({ where: { username } });
      return { message: 'deleted successfully' };
    } catch (error) {
      throw new Error(error);
    }
  }

  async follow(username: string, context) {
    try {
      const followed = await this.AuthorModel.findOne({ where: { username } });
      if (!followed) {
        throw new NotFoundException('author you want to follow not found');
      }
      if(followed.id === context.author.id){
        throw new Error('You can\'t follow yourself')
      }

      const allFollowRecords = await this.FollowModel.findAll({where : {followedId : followed.id , followerId : context.author.id}})
      allFollowRecords.forEach(follow => {
        if (follow.followerId === context.author.id){
          throw new Error('You have already followed this author')
        }
      })
      await this.FollowModel.create({
        followedId: followed.id,
        followerId: context.author.id, 
      });
      // const countOfFollowers_follower = await this.FollowModel.count({where : {followedId : context.author.id}})
      // const countOfFollowed_follower = await this.FollowModel.count({where : {followerId : context.author.id}})
      // const countOfFollowed_followed = await this.FollowModel.count({where : {followedId : followed.id}})
      // const countOfFollowers_followed = await this.FollowModel.count({where : {followerId : followed.id}})
      // await this.AuthorModel.update({numFollowing : countOfFollowed_follower , numFollowers :countOfFollowers_follower } , {where : {id : context.author.id}})
      // await this.AuthorModel.update({numFollowing : countOfFollowed_followed , numFollowers :countOfFollowers_followed } , {where : {id : followed.id}})
      await this.AuthorModel.increment({numFollowing : 1},{where : {id : context.author.id}})
      await this.AuthorModel.increment({numFollowers : 1},{where : {id : followed.id}})
      return {
        message: `${context.author.username} has just followed ${followed.username}`,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async unfollow(username : string , context){
    try {
      const followed = await this.AuthorModel.findOne({ where: { username } });
      if (!followed) {
        throw new NotFoundException('author you want to follow not found');
      }
      const followRecord = await this.FollowModel.findOne({where : {followedId : followed.id , followerId : context.author.id}})
      if(!followRecord){
        throw new Error('You don\'t follow this author')
      }
      await this.FollowModel.destroy({where : {followedId : followed.id , followerId : context.author.id}})
      await this.AuthorModel.increment({numFollowing : -1},{where : {id : context.author.id}})
      await this.AuthorModel.increment({numFollowers : -1},{where : {id : followed.id}})
      return {
        message : `success`
      }
    } catch (error) {
      
    }
  }

  async getMyFollowers(context): Promise<getMyFollowersOutPut> {
    try {
      const followInfo = await this.FollowModel.findAll({
        where: { followedId: context.author.id },
      });
      if (!followInfo || followInfo.length === 0) {
        throw new NotFoundException("You don't have any followers");
      }
      const followersIds = [];
      followInfo.forEach((follow) => followersIds.push(follow.followerId));
      const allFollowers = await this.AuthorModel.findAll({
        where: { id: { [Op.in]: followersIds } },
      });
      const followers: MyFollowersOutPut[] = allFollowers.map((follow) => ({
        username: follow.username,
        id: follow.id,
      }));
      const result = {
        numberOfFollowers: followersIds.length,
        followers: followers,
      };
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getWhoIFollow(context) {
    try {
      const followInfo = await this.FollowModel.findAll({
        where: { followerId: context.author.id },
      });
      if (!followInfo || followInfo.length === 0) {
        throw new NotFoundException("You didn\'t follow anyone yet");
      }
      const followeingIds = [];
      followInfo.forEach((follow) => followeingIds.push(follow.followedId));
      
      const allFollowings = await this.AuthorModel.findAll({
        where: { id: { [Op.in]: followeingIds } },
      });
      const followers: MyFollowersOutPut[] = allFollowings.map((follow) => ({
        username: follow.username,
        id: follow.id,
      }));
      const result = {
        numberOfFollowing: followeingIds.length,
        whoYouFollowers: followers,
      };
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async like(tweetId , context){
    try {
      const likedTweet = await this.likersModel.findOne({where : {authorId : context.author.id , tweetId}})
      if (likedTweet){
        return {
          message : "you have already liked the tweet"
        }
      }
      await this.likersModel.create({authorId : context.author.id , tweetId})
      return {
        message : `${context.author.userame} have just liked tweet with id of ${tweetId}`
      }
    } catch (error) { 
      throw new Error(error)
    }
  }

}
