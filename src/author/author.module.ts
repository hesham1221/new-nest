import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorResolver } from './author.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Author } from './entities/author.entity';
import { jwtStratagey } from './jwt.stratagy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthorResolver, AuthorService, jwtStratagey],
  imports : [SequelizeModule.forFeature([Author]) , JwtModule.register({
    signOptions : {expiresIn : '300s'},
    secret : 'baianat-tweeter'
  })],
  exports :[AuthorService , jwtStratagey]
})
export class AuthorModule {}
