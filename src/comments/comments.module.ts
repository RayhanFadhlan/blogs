import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from 'src/blogs/entities/blog.entity';
import { Comment } from './entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Blog, User])],
  controllers: [CommentsController],
  providers: [CommentsService, JwtService],
})
export class CommentsModule {}
