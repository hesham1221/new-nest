import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()

export class AuthorWithoutPass {
    @Field(() => Int)
    id : number

    @Field()
    userame : string
}