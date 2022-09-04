import { Resolver, Query, Mutation, Args, Int, Context, ResolveField } from '@nestjs/graphql';
import { AuthorService } from './author.service';
import { Author } from './entities/author.entity';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { AuthMessage } from './dto/login-output';
import { AuthGuard} from './jwt.auth.guard';
import { Res, UseGuards } from '@nestjs/common';
import { Message } from 'src/tweets/Tweet.model';
import { getMyFollowersOutPut } from './dto/getMyFollowers.output';
import { getWhoIFollowOutput } from './dto/getWhoIFollow.output';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import * as fs from 'fs/promises';
import { Response } from 'express';

@Resolver(() => Author)
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Mutation(() => String, { name: 'ProfilePhoto' })
  async uploadPhoto(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<string> {
    return await this.authorService.uploadPhoto(file)
  }

  @Query(() => String)
  @UseGuards(new AuthGuard)
  getProfilePhoto(@Res()response : Response , @Context() context){
    return this.authorService.getProfilePhoto(context , response)
  }
  

  @Mutation(() => AuthMessage)
  createAuthor(@Args('createAuthorInput') createAuthorInput: CreateAuthorInput) {
    return this.authorService.create(createAuthorInput);
  }
  @Query(() => AuthMessage )
  login(@Args('loginInput')loginUnput : CreateAuthorInput){
    return this.authorService.Login(loginUnput)
  }

  @Query(() => [Author], { name: 'authors' })
  author() {
    return this.authorService.findAll();
  }

  @Query(() => Author, { name: 'validAuthor' })
  @UseGuards(new AuthGuard())
  validAuthor(@Context() context) {
    return this.authorService.valid(context);
  }

  @Query(() => Author)
  findOneAuthor(@Args('id', { type: () => Int }) id: number) {
    return this.authorService.findOne(id);
  }
  @Mutation(() => Author)
  @UseGuards(new AuthGuard())
  updateAuthor(@Args('updateAuthorInput') updateAuthorInput: UpdateAuthorInput , @Context() context) {
    return this.authorService.update(updateAuthorInput , context);
  }
  @Mutation(() => Message)
  @UseGuards(new AuthGuard())
  removeAuthor(@Args('username', { type: () => String }) username: string) {
    return this.authorService.remove(username);
  }

  @Query(() => getMyFollowersOutPut , {name : "myFollowers"})
  @UseGuards(new AuthGuard())
  getMyFollowers(@Context() context) :Promise<getMyFollowersOutPut>{
    return this.authorService.getMyFollowers(context)
  }
  @Query(() => getWhoIFollowOutput , {name : "following"})
  @UseGuards(new AuthGuard())
  getWhoIFollow(@Context() context){
    return this.authorService.getWhoIFollow(context)
  }

  @Mutation(() => Message)
  @UseGuards(new AuthGuard())
  follow(@Args('username', {type : () => String})username : string , @Context()context ){
    return this.authorService.follow(username , context)
  }

  @Mutation(() => Message)
  @UseGuards(new AuthGuard())
  like(@Args('tweetId' , {type : () => Int})tweetId : number , @Context()context){
    return this.authorService.like(tweetId , context)
  }

  @Mutation(() => Message)
  @UseGuards(new AuthGuard)
  unfollow(@Args('username') username : string , @Context() context){
    return this.authorService.unfollow(username , context)
  }

}
