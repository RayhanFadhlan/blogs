import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentResponseDto, CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommentOwnerGuard } from './guards/comment-owner.guard';
import {
  SwaggerDeleteComment,
  SwaggerGetComments,
  SwaggerPostComment,
  SwaggerUpdateComment,
} from 'src/swagger/comment';
import { ResponseMessage } from 'src/common/decorator/response-message.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Comment created successfully')
  @SwaggerPostComment()
  async create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    const comment = await this.commentsService.create(
      createCommentDto,
      req.user.id,
    );
    return CommentResponseDto.fromEntity(comment);
  }

  @Get(':blogId')
  @ResponseMessage('Comments retrieved successfully')
  @SwaggerGetComments()
  async findAllByBlog(@Param('blogId') blogId: number) {
    const comments = await this.commentsService.findAllByBlog(blogId);
    return comments.map((comment) => CommentResponseDto.fromEntity(comment));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, CommentOwnerGuard)
  @ResponseMessage('Comment updated successfully')
  @SwaggerUpdateComment()
  async update(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return CommentResponseDto.fromEntity(
      await this.commentsService.update(id, updateCommentDto),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, CommentOwnerGuard)
  @ResponseMessage('Comment deleted successfully')
  @SwaggerDeleteComment()
  remove(@Param('id') id: number) {
    return this.commentsService.remove(id);
  }
}
