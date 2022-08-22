import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt } from "class-validator";

@InputType()
export class getATweetDto {
    @IsInt()
    @Field(() => Int)
    id:number
}