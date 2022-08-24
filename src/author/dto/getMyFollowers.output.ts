import { Field, Int, ObjectType } from "@nestjs/graphql";




@ObjectType()
export class MyFollowersOutPut{
    @Field(() => Int)
    id:number

    @Field()
    username:string
}

@ObjectType()
export class getMyFollowersOutPut{
    @Field(() => Int)
    numberOfFollowers : number

    @Field(() => [MyFollowersOutPut])
    followers : MyFollowersOutPut[]
}

