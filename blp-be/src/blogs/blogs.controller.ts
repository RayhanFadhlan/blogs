import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Query,
  Param,
  DefaultValuePipe,
  Put,
  Delete,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';

import { FormDataRequest } from 'nestjs-form-data';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogOwnerGuard } from './guards/blog-owner.guard';
import {
  SwaggerCreateBlog,
  SwaggerDeleteBlog,
  SwaggerGetBlog,
  SwaggerGetBlogs,
  SwaggerUpdateBlog,
} from 'src/swagger/blog';
import { ResponseMessage } from 'src/common/decorator/response-message.decorator';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @FormDataRequest()
  @UseGuards(JwtAuthGuard)
  @SwaggerCreateBlog()
  @ResponseMessage('Blog created successfully')
  async create(@Body() createBlogDto: CreateBlogDto, @Request() req) {
    return await this.blogsService.create(createBlogDto, req.user.id);
  }

  @Get()
  @SwaggerGetBlogs()
  @ResponseMessage('Blogs retrieved successfully')
  async findAll(
    @Query('page', new DefaultValuePipe(1))
    page: number,
    @Query('limit', new DefaultValuePipe(10))
    limit: number,
  ) {
    console.log('tes 1');
    return await this.blogsService.findAll(page, limit);
  }

  @Get('user/:id')
  @SwaggerGetBlogs()
  @ResponseMessage('Blog retrieved successfully')
  async findUserBlogs(
    @Request() req,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Param('id') id: number,
  ) {
    return await this.blogsService.findByUser(id, page, limit);
  }

  @Get(':id')
  @SwaggerGetBlog()
  @ResponseMessage('Blog retrieved successfully')
  async findOne(@Param('id') id: string) {
    return await this.blogsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, BlogOwnerGuard)
  @FormDataRequest()
  @SwaggerUpdateBlog()
  @ResponseMessage('Blog updated successfully')
  async update(@Param('id') id: number, @Body() updateBlogDto: UpdateBlogDto) {
    return await this.blogsService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, BlogOwnerGuard)
  @SwaggerDeleteBlog()
  @ResponseMessage('Blog deleted successfully')
  async remove(@Param('id') id: number) {
    return await this.blogsService.remove(+id);
  }
}
