import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';

import { FormDataRequest } from 'nestjs-form-data';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @FormDataRequest()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createBlogDto: CreateBlogDto, @Request() req){
    return this.blogsService.create(createBlogDto, req.user.id);
  }

  // @Get()
  // async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
  //   return this.blogsService.findAll(page, limit);
  // }

  // @Get('user')
  // @UseGuards(JwtAuthGuard)
  // async findUserBlogs(
  //   @Request() req,
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 10
  // ) {
  //   return this.blogsService.findByUser(req.user.id, page, limit);
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.blogsService.findOne(+id);
  // }

  // @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(FileInterceptor('thumbnail'))
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateBlogDto: UpdateBlogDto,
  //   @UploadedFile() file: Express.Multer.File
  // ) {
  //   if (file) {
  //     updateBlogDto.thumbnail = file.path;
  //   }
  //   return this.blogsService.update(+id, updateBlogDto);
  // }

  // @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  // async remove(@Param('id') id: string) {
  //   return this.blogsService.remove(+id);
  // }
}
