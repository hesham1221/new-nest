import { Field, Int } from "@nestjs/graphql";
import { AutoIncrement, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Author } from "./author.entity";

@Table

export class Follow extends Model<Follow>{
    @PrimaryKey
    @AutoIncrement
    @Column
    @Field(() => Int)
    id:number

    @ForeignKey(() => Author) 
    @Column({onDelete : 'cascade' , onUpdate : "cascade"})
    @Field(() => Int)
    followerId : number

    @ForeignKey(() => Author)
    @Column({onDelete : 'cascade' , onUpdate : "cascade"})
    @Field(() => Int)
    followedId : number
} 
 
