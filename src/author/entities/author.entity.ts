import { ObjectType, Field, Int} from '@nestjs/graphql';

import { AutoIncrement, BelongsTo, BelongsToMany, Column, Default, HasMany, Model, PrimaryKey, Table, Unique  } from 'sequelize-typescript';
import { likers } from 'src/tweets/likers.model';

import { Tweet } from 'src/tweets/Tweet.model';

@ObjectType()
@Table
export class Author extends Model<Author> {
  @PrimaryKey
  @AutoIncrement
  @Column
  @Field(() => Int)
  id:number

  @Unique
  @Column
  @Field()
  username :string

  @Column
  password : string

  @Default(0)
  @Column
  @Field(() => Int)
  followers : number 

  @Default(0) 
  @Column
  @Field(() => Int)
  following : number

  
  @HasMany(() => likers , { onDelete: 'cascade'})
  likedTweets : Tweet[]

  @HasMany(() => Tweet , { onDelete: 'cascade'})
  @Field(() => [Tweet],{nullable : true})
  tweets? : Tweet[]

}



