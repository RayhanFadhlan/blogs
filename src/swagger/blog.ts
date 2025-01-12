import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { CreateBlogResponseDto } from "src/blogs/dto/create-blog.dto";
import { TagDto } from "src/blogs/dto/tag.dto";
import { BlogResponseDto, PaginatedBlogResponseDto } from "src/blogs/dto/get-blog.dto";
import { ResponseDto } from "src/common/dto/base-response.dto";
import { PaginationMetaDto } from "src/common/dto/pagination.dto";
import { UserDto } from "src/users/dto/user.dto";

export function SwaggerCreateBlog() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new blog',
      description: 'Create a new blog post with title, content, thumbnail image and optional tags'
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        required: [],
        type: 'object',
        properties: {
          title: {
            type: 'string',
            example: 'My first blog'
          },
          content: {
            type: 'string',
            example: 'This is my first blog content'
          },
          thumbnail: {
            type: 'string',
            format: 'binary',
            
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['tag1', 'tag2'], // Example usage

          },
        }
      }
    }),
    ApiCreatedResponse({
      content: {
        body: {
          example: ResponseDto.success(
            'Blog created successfully',
            201,
            new CreateBlogResponseDto(
              1,
              'My first blog',
              'This is my first blog content',
              'http://localhost:3000/thumbnails/1.jpg',
              new Date(),
              new Date(),
              [{
                id: 1,
                name: 'tag1'
              }, {
                id: 2,
                name: 'tag2'
              }]
            ) 
          )
        }
      }
    })
  )
}

export function SwaggerGetBlogs() {
  
  return applyDecorators(
    ApiOperation({
      summary: 'Get all blogs',
      description: 'Retrieve all blogs with pagination support. Returns blog posts with their associated user and tags'
    }),
    ApiOkResponse({
      content: {
        body: {
          example: ResponseDto.success(
            'Blogs retrieved successfully',
            200,
            new PaginatedBlogResponseDto(
              [
                new BlogResponseDto(
                  22,
                  "My first blog",
                  "This is my first blog content",
                  "uploads/f838ff55-d3d0-471d-89af-24484b6ba999.jpg",
                  new Date("2025-01-12T09:29:59.386Z"),
                  new Date("2025-01-12T09:29:59.386Z"),
                  new UserDto(1, "rayhanfa", "rayhanfa"),
                  [
                    new TagDto(4, "tag1"),
                    new TagDto(6, "string")
                  ]
                )
              ],
              new PaginationMetaDto(21, 1, 1)
            )
          )
        }
      }
    })
  )
}

export function SwaggerGetBlog() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a specific blog',
      description: 'Retrieve a single blog post by its ID, including user information and associated tags'
    }),
    ApiOkResponse({
      content: {
        body: {
          example: ResponseDto.success(
            'Blog retrieved successfully',
            200,
            new BlogResponseDto(
              22,
              "My first blog",
              "This is my first blog content",
              "uploads/f838ff55-d3d0-471d-89af-24484b6ba999.jpg",
              new Date("2025-01-12T09:29:59.386Z"),
              new Date("2025-01-12T09:29:59.386Z"),
              new UserDto(1, "rayhanfa", "rayhanfa"),
              [
                new TagDto(4, "tag1"),
                new TagDto(6, "string")
              ]
            )
          )
        }
      }
    })
  )
}

export function SwaggerUpdateBlog(){
  return applyDecorators(
    ApiOperation({
      summary: 'Update a blog',
      description: 'Update an existing blog post. All fields are optional. Only provided fields will be updated'
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            example: 'My first blog'
          },
          content: {
            type: 'string',
            example: 'This is my first blog content'
          },
          thumbnail: {
            type: 'string',
            format: 'binary'
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['tag1', 'tag2'], // Example usage

          },
        }
      }
    }),
    ApiOkResponse({
      content: {
        body: {
          example: ResponseDto.success(
            'Blog updated successfully',
            200,
            new CreateBlogResponseDto(
              1,
              'My first blog',
              'This is my first blog content',
              'http://localhost:3000/thumbnails/1.jpg',
              new Date(),
              new Date(),
              [{
                id: 1,
                name: 'tag1'
              }, {
                id: 2,
                name: 'tag2'
              }]
            ) 
          )
        }
      }
    })
  )
}

export function SwaggerDeleteBlog(){
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a blog',
      description: 'Delete a blog post by its ID. Only the owner of the blog can delete it'
    }),
    ApiOkResponse({
      content: {
        body: {
          example: ResponseDto.success(
            'Blog deleted successfully',
            200,
            null
          )
        }
      }
    })
  )
}