import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { Tag } from './entities/tag.entity';
import { User } from '../users/entities/user.entity';

import { FileUploadService } from 'src/storage/storage.service';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private fileUploadService: FileUploadService,
  ) {}

  async create(createBlogDto: CreateBlogDto, userId: number): Promise<Blog> {
    let thumbnailPath: string;
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) throw new NotFoundException('User not found');

      thumbnailPath = await this.fileUploadService.uploadFile(
        createBlogDto.thumbnail,
      );

      const blog = this.blogRepository.create({
        title: createBlogDto.title,
        content: createBlogDto.content,
        thumbnail: thumbnailPath,
        user: user,
      });

      // Save blog first to get ID
      const savedBlog = await this.blogRepository.save(blog);

      // Handle tags if they exist
      if (createBlogDto.tags) {
        const tagNames = createBlogDto.tags.split(',').map((tag) => tag.trim());
        const tags = await Promise.all(
          tagNames.map(async (tagName) => {
            let tag = await this.tagRepository.findOneBy({ name: tagName });
            if (!tag) {
              tag = this.tagRepository.create({ name: tagName });
              await this.tagRepository.save(tag);
            }
            return tag;
          }),
        );

        savedBlog.tags = tags;
        await this.blogRepository.save(savedBlog);
      }

      return this.blogRepository.findOne({
        where: { id: savedBlog.id },
        relations: ['tags'],
      });
    } catch (error : unknown) {
      if(thumbnailPath){
        await this.fileUploadService.deleteFile(thumbnailPath);
      }
      throw error;
      
    }
  }

  async findAll(page = 1, limit = 10) {
    const [blogs, total] = await this.blogRepository.findAndCount({
      relations: ['user', 'tags'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      blogs: blogs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['user', 'tags'],
    });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.findOne(id);

    if (updateBlogDto.tags) {
      const tagNames = updateBlogDto.tags.split(',').map((tag) => tag.trim());
      const tags = await Promise.all(
        tagNames.map(async (tagName) => {
          let tag = await this.tagRepository.findOneBy({ name: tagName });
          if (!tag) {
            tag = this.tagRepository.create({ name: tagName });
            await this.tagRepository.save(tag);
          }
          return tag;
        }),
      );
      blog.tags = tags;
    }
    if (updateBlogDto.thumbnail) {
      const thumbnailPath = await this.fileUploadService.uploadFile(
        updateBlogDto.thumbnail,
      );
      await this.fileUploadService.deleteFile(blog.thumbnail);
      blog.thumbnail = thumbnailPath;
      console.log(thumbnailPath);
    }
    blog.title = updateBlogDto.title;
    blog.content = updateBlogDto.content;

    await this.blogRepository.save(blog);

    return this.blogRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

  }

  async remove(id: number): Promise<void> {
    const blog = await this.findOne(id);
    await this.fileUploadService.deleteFile(blog.thumbnail);
    await this.blogRepository.remove(blog);
  }

  async findByUser(userId: number, page = 1, limit = 10) {
    const [blogs, total] = await this.blogRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['tags'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      blogs: blogs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
