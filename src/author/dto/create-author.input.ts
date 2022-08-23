import { InputType, Int, Field } from '@nestjs/graphql';
import { MinLength} from 'class-validator';

@InputType()
export class CreateAuthorInput {
  
  @Field()
  username :string

  @MinLength(8)
  @Field()
  password :string
}
