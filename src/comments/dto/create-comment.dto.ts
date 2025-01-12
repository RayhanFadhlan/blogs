import { IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from 'src/users/dto/user.dto';

export class CreateCommentDto {

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  blogId: number;
}

export class CommentResponseDto {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserDto;

  constructor(id: number, content: string, createdAt: Date, updatedAt: Date, user: UserDto) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.user = user;
  }

  static fromEntity(comment: any): CommentResponseDto {
    return new CommentResponseDto(comment.id, comment.content, comment.createdAt, comment.updatedAt, comment.user);
  }
}