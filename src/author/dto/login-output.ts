import { Field, ObjectType } from "@nestjs/graphql"
import { Author } from "../entities/author.entity"

@ObjectType()
export class AuthMessage{
  @Field()
  token : string
  @Field(() => Author) 
  author : Author
}