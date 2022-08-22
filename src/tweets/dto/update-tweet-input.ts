import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class UpdateATweet {
    @Field(() => Int)
    id : number;
    @Field()
    content : string
}