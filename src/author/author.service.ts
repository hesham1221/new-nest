import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message, Tweet } from 'src/tweets/Tweet.model';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { Author } from './entities/author.entity';
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthorService {
  constructor(@InjectModel(Author) private AuthorModel : typeof Author , private jwtService : JwtService){}

  async create(createAuthorInput: CreateAuthorInput):Promise<Author> {
    const {username , password} = createAuthorInput
    const newPassword:string = await bcrypt.hash(password , 10)
    try {
      return await this.AuthorModel.create({username , password :newPassword}) 
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll():Promise<Author[]> {
    try {
      return await this.AuthorModel.findAll({include : [Tweet]});
      
    } catch (error) {
      throw new Error(error);
      
    }
  }

  async findOne(id :number):Promise<Author> {
    try {
      return await this.AuthorModel.findOne({where : {id}});
    } catch (error) {
      throw new NotFoundException
    }
  }

  async Login(loginInput:CreateAuthorInput){

    const {username , password} = loginInput;
    try {
      const author = await this.AuthorModel.findOne({where : {username}})
      if(author){
        const isValid = await bcrypt.compare(password ,author.password )
        if(isValid){
          return ({
            token : jwt.sign({username : author.username , id : author.id} , 'baianat-tweeter') ,
            username : author.username
          })
        }else {
          throw UnauthorizedException
        }
      }else {
        throw new NotFoundException
      }
    } catch (error) {
      throw new NotFoundException('user not found')
    }
  }

  async update(updateAuthorInput: UpdateAuthorInput):Promise<Author> {
    const {oldUsername , newUsername} = updateAuthorInput
    try {
      await this.AuthorModel.update({username : newUsername} , {where :{username : oldUsername}}) 
      return await this.AuthorModel.findOne({where : {username : newUsername}})
      
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(username: string):Promise<Message> {
    try {
      await this.AuthorModel.destroy({where : {username}})
      return {message : 'deleted successfully'}
      
    } catch (error) {
      throw new Error(error)
    }
    
  }
}
