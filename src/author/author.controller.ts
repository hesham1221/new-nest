import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('authors-profilePics')
export class AuthorController {
    @Get(':pic')
    getFile(@Param('pic') pic: string , @Res()response : Response){
        const file = join(process.cwd() , 'authors-profilePics' , pic)
        response.sendFile(file)
    }
}
