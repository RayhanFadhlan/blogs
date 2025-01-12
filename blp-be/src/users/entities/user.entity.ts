import { Exclude } from "class-transformer";
import { Blog } from "src/blogs/entities/blog.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Unique(['username'])
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Blog, blog => blog.user)
  blogs: Blog[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];
}
