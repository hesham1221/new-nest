import { ObjectType, Field, Int} from '@nestjs/graphql';

import { AutoIncrement, BelongsTo, Column, Default, ForeignKey, HasMany, Model, PrimaryKey, Table  } from 'sequelize-typescript';
import { Sequelize } from 'sequelize/types';

import { Tweet } from 'src/tweets/Tweet.model';

@ObjectType()
@Table
export class Author extends Model<Author> {
  @PrimaryKey
  @AutoIncrement
  @Column
  @Field(() => Int)
  id:number

  @Column
  @Field()
  username :string

  @Column
  @Field()
  password : string

  @Default(0)
  @Column
  @Field(() => Int)
  followers : number

  @Default(0) 
  @Column
  @Field(() => Int)
  following : number

  @ForeignKey(() => Tweet)
  @Column
  @Field(() => Int)
  tweetId: number;

  @HasMany(() => Tweet)
  @Field(() => [Tweet],{nullable : true})
  tweets? : Tweet[]

}



