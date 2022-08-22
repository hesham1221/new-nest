import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorResolver } from './author.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Author } from './entities/author.entity';

@Module({
  providers: [AuthorResolver, AuthorService],
  imports : [SequelizeModule.forFeature([Author])],
  exports :[AuthorService]
})
export class AuthorModule {}
