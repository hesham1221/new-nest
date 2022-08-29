import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class findAllOutput{
    @Field()
    username : string


    @Field(() => Int)
    id : number
}