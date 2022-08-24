import { Field, Int, ObjectType } from "@nestjs/graphql";




@ObjectType()
export class MyFollowingOutPut{
    @Field(() => Int)
    id:number

    @Field()
    username:string
}

@ObjectType()
export class getWhoIFollowOutput{
    @Field(() => Int)
    numberOfFollowing : number

    @Field(() => [MyFollowingOutPut])
    whoYouFollowers : MyFollowingOutPut[]
}

