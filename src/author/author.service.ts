import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message, Tweet } from 'src/tweets/Tweet.model';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorService {
  constructor(@InjectModel(Author) private AuthorModel : typeof Author){}

  async create(createAuthorInput: CreateAuthorInput):Promise<Author> {
    const {name} = createAuthorInput

    try {
      return await this.AuthorModel.create({name}) 
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

  async update(updateAuthorInput: UpdateAuthorInput):Promise<Author> {
    const {id , name} = updateAuthorInput
    try {
      await this.AuthorModel.update({name} , {where :{id}}) 
      return await this.AuthorModel.findOne({where : {id}})
      
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(id: number):Promise<Message> {
    try {
      await this.AuthorModel.destroy({where : {id}})
      return {message : 'deleted successfully'}
      
    } catch (error) {
      throw new Error(error)
    }
    
  }
}
