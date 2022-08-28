import { InputType, Field, Int } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';


@InputType()
export class UpdateAuthorInput {

  @Field({nullable : true})
  username: string;

  @Field()
  oldPassword : string

  @Field({nullable : true})
  password : string

}
