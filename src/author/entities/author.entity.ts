import { ObjectType, Field, Int} from '@nestjs/graphql';

import { AutoIncrement, Column, HasMany, Model, PrimaryKey, Table  } from 'sequelize-typescript';
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

  @HasMany(() => Tweet)
  @Field(() => [Author] , {nullable : true})
  followers : Author[]

  @HasMany(() => Tweet)
  @Field(() => [Author] , {nullable : true})
  follwing : Author[]

  @HasMany(() => Tweet)
  @Field(() => [Tweet],{nullable : true})
  tweets? : Tweet[]

}



