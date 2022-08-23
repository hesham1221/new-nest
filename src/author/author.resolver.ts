import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthorService } from './author.service';
import { Author } from './entities/author.entity';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { AuthMessage } from './dto/login-output';
import { AuthGuard} from './jwt.auth.guard';
import { UseGuards } from '@nestjs/common';
import { Message } from 'src/tweets/Tweet.model';

@Resolver(() => Author)
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Mutation(() => Author)
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

  @Query(() => Author)
  findOneAuthor(@Args('id', { type: () => Int }) id: number) {
    return this.authorService.findOne(id);
  }
  @Mutation(() => Author)
  @UseGuards(new AuthGuard())
  updateAuthor(@Args('updateAuthorInput') updateAuthorInput: UpdateAuthorInput) {
    return this.authorService.update(updateAuthorInput);
  }
  @Mutation(() => Message)
  @UseGuards(new AuthGuard())
  removeAuthor(@Args('username', { type: () => String }) username: string) {
    return this.authorService.remove(username);
  }
}
