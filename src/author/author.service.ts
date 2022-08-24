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
import { Follow } from './entities/follow.entity';
import { Op } from 'sequelize';
import {
  getMyFollowersOutPut,
  MyFollowersOutPut,
} from './dto/getMyFollowers.output';
@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author) private AuthorModel: typeof Author,
    @InjectModel(Follow) private FollowModel: typeof Follow,
  ) {}

  async create(createAuthorInput: CreateAuthorInput): Promise<Author> {
    const { username, password } = createAuthorInput;
    const newPassword: string = await bcrypt.hash(password, 10);
    try {
      return await this.AuthorModel.create({ username, password: newPassword });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<Author[]> {
    try {
      return await this.AuthorModel.findAll({ include: [Tweet] });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number): Promise<Author> {
    try {
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
                expiresIn: '5m',
              },
            ),
            username: author.username,
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

  async update(updateAuthorInput: UpdateAuthorInput): Promise<Author> {
    const { oldUsername, newUsername } = updateAuthorInput;
    try {
      await this.AuthorModel.update(
        { username: newUsername },
        { where: { username: oldUsername } },
      );
      return await this.AuthorModel.findOne({
        where: { username: newUsername },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(username: string): Promise<Message> {
    try {
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
      console.log(followed.id , context.author.authorId)
      if(followed.id === context.author.id){
        throw new Error('You can\'t follow yourself')
      }

      const allFollowRecords = await this.FollowModel.findAll({where : {followedId : followed.id}})
      allFollowRecords.forEach(follow => {
        if (follow.followerId === context.author.id){
          throw new Error('You have already followed this author')
        }
      })
      await this.FollowModel.create({
        followedId: followed.id,
        followerId: context.author.id,
      });
      return {
        message: `${context.author.username} has just followed ${followed.username}`,
      };
    } catch (err) {
      throw new Error(err);
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
}
