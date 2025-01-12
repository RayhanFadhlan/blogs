import { PaginationMetaDto } from "src/common/dto/pagination.dto";
import { TagDto } from "./tag.dto";
import { UserDto } from "src/users/dto/user.dto";



export class BlogResponseDto {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserDto;
  tags: TagDto[];

  constructor(
    id: number,
    title: string,
    content: string,
    thumbnail: string,
    createdAt: Date,
    updatedAt: Date,
    user: UserDto,
    tags: TagDto[]
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.thumbnail = thumbnail;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.user = user;
    this.tags = tags;
  }
}

export class PaginatedBlogResponseDto {
  blogs: BlogResponseDto[];
  meta: PaginationMetaDto;

  constructor(blogs: BlogResponseDto[], meta: PaginationMetaDto) {
    this.blogs = blogs;
    this.meta = meta;
  }

  static create(
    blogs: BlogResponseDto[], 
    total: number, 
    page: number, 
    limit: number
  ): PaginatedBlogResponseDto {
    const meta = new PaginationMetaDto(total, page, limit);
    return new PaginatedBlogResponseDto(blogs, meta);
  }
}