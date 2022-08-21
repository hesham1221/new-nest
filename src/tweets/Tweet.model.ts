import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Model, Table } from 'sequelize-typescript';

@Table
@ObjectType()
export class Tweet extends Model{
  @Column
  @Field()
  content: string;
  @Column
  @Field()
  author: string;
}
