import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Author } from 'src/author/entities/author.entity';

@Table
@ObjectType()
export class Tweet extends Model<Tweet> {
  @PrimaryKey
  @AutoIncrement
  @Column
  @Field(() => Int)
  id: number;

  @Column
  @Field()
  content: string;

  @ForeignKey(() => Author)
  @Column
  @Field(() => Int)
  authorId: number;

  @BelongsTo(() => Author)
  @Field(() => Author)
  author: Author;
}

@ObjectType()
export class Message {
  @Field()
  message: string;
}

@ObjectType()
export class TweetRes {
  @Field()
  message: string;

  @Field()
  data: Tweet;

  @Field()
  code: number;
}
