import { Field, Int } from "@nestjs/graphql";
import { AutoIncrement, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Author } from "src/author/entities/author.entity";
import { Tweet } from "./Tweet.model";


@Table
export class likers extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column
    @Field(() => Int)
    id:number

    @ForeignKey(() => Author)
    @Column
    authorId : number

    @ForeignKey(() => Tweet)
    @Column
    tweetId : number
}