import { ObjectType, Field, Int} from '@nestjs/graphql';

import { AutoIncrement, BelongsTo, BelongsToMany, Column, Default, HasMany, Model, PrimaryKey, Table  } from 'sequelize-typescript';
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

  
  @HasMany(() => likers)
  likedTweets : Tweet[]

  @HasMany(() => Tweet)
  @Field(() => [Tweet],{nullable : true})
  tweets? : Tweet[]

}



