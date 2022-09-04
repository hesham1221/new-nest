import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorResolver } from './author.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Author } from './entities/author.entity';
import { Follow } from './entities/following.entity';
import { likers } from 'src/tweets/likers.model';
import { AuthorController } from './author.controller';

@Module({
  providers: [AuthorResolver, AuthorService],
  imports: [
    SequelizeModule.forFeature([Author]),
    SequelizeModule.forFeature([Follow]),
    SequelizeModule.forFeature([likers]),
  ],
  exports: [AuthorService],
  controllers: [AuthorController],
})
export class AuthorModule {}
