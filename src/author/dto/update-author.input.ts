import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateAuthorInput {

  @Field(() => Int)
  id : number

  @Field()
  name: string;
}
