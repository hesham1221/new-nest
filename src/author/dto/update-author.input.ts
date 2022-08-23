import { InputType, Field, Int } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';


@InputType()
export class UpdateAuthorInput {

  @Field()
  oldUsername : string
  @IsAlpha()
  @Field()
  newUsername: string;
}
