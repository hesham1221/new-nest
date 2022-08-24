import { Field, Int, ObjectType } from "@nestjs/graphql";
import { AutoIncrement, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table

export class Follow extends Model<Follow>{
    @PrimaryKey
    @AutoIncrement
    @Column
    @Field(() => Int)
    id:number

    @Column
    @Field(() => Int)
    followerId : number

    @Column
    @Field(() => Int)
    followedId : number
}

