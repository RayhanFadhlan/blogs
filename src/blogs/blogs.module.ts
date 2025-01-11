import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Tag } from './entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { FileUploadService } from 'src/storage/storage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog,Tag,User])
  ],
  controllers: [BlogsController],
  providers: [BlogsService, JwtService, FileUploadService],
})
export class BlogsModule {}
