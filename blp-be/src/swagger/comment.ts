import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CommentResponseDto } from 'src/comments/dto/create-comment.dto';
import { ResponseDto } from 'src/common/dto/base-response.dto';
import { UserDto } from 'src/users/dto/user.dto';

export function SwaggerPostComment() {
  return applyDecorators(
    ApiCreatedResponse({
      description: 'Comment created successfully',
      content: {
        body: {
          example: ResponseDto.success(
            'Comment created successfully',
            201,
            new CommentResponseDto(
              1,
              'This is my first comment',
              new Date(),
              new Date(),
              new UserDto(1, 'John Doe', 'johndoe')
            ),
          ),
        },
      },
    }),
  );
}

export function SwaggerGetComments() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Comments fetched successfully',
      content: {
        body: {
          example: ResponseDto.success(
            'Comments fetched successfully',
            200,
            [
              new CommentResponseDto(
                1,
                'This is my first comment',
                new Date(),
                new Date(),
                new UserDto(1, 'John Doe', 'johndoe')
              ),
            ],
          ),
        },
      },
    }),
  );
}

export function SwaggerUpdateComment() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Comment updated successfully',
      content: {
        body: {
          example: ResponseDto.success(
            'Comment updated successfully',
            200,
            new CommentResponseDto(
              1,
              'This is my updated comment',
              new Date(),
              new Date(),
              new UserDto(1, 'John Doe', 'johndoe')
            ),
          ),
        },
      },
    }),
  );
}

export function SwaggerDeleteComment() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Comment deleted successfully',
      content: {
        body: {
          example: ResponseDto.success(
            'Comment deleted successfully',
            200,
            null,
          ),
        },
      },
    }),
  );
}