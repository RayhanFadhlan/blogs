import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from 'src/blogs/entities/blog.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: number,
  ): Promise<Comment> {
    const blog = await this.blogRepository.findOneBy({
      id: createCommentDto.blogId,
    });
    if (!blog) throw new NotFoundException('Blog not found');

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      blog,
      user,
    });

    return this.commentRepository.save(comment);
  }

  async findAllByBlog(blogId: number) {
    return this.commentRepository.find({
      where: { blog: { id: blogId } },
      relations: ['user', 'blog'],
    });
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'blog'],
    });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.findOne(id);
    Object.assign(comment, updateCommentDto);
    return this.commentRepository.save(comment);
  }

  async remove(id: number): Promise<void> {
    const comment = await this.findOne(id);
    await this.commentRepository.remove(comment);
  }
}
