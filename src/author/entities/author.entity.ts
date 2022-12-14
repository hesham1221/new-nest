import { ObjectType, Field, Int} from '@nestjs/graphql';

import { AutoIncrement, BelongsTo, BelongsToMany, Column, Default, HasMany, Model, PrimaryKey, Table, Unique  } from 'sequelize-typescript';
import { likers } from 'src/tweets/likers.model';

import { Tweet } from 'src/tweets/Tweet.model';
import { Follow} from './following.entity';

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

  @Field()
  following : boolean

  @Column
  password : string

  @Default(0)
  @Column
  @Field(() => Int)
  numFollowers : number 

  @Default(0) 
  @Column
  @Field(() => Int)
  numFollowing : number

  
  @HasMany(() => Follow ,{ onDelete: 'cascade' , foreignKey : "followerId"})
  follower : Follow[]

  @HasMany(() => Follow , { onDelete: 'cascade' , foreignKey : "followedId"})
  followed : Follow[]


  @HasMany(() => likers , { onDelete: 'cascade'})
  likedTweets : Tweet[]

  @HasMany(() => Tweet , { onDelete: 'cascade'})
  @Field(() => [Tweet],{nullable : true}) 
  tweets? : Tweet[]

}



