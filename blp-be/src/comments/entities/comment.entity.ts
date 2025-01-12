import { Blog } from "src/blogs/entities/blog.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.comments, {onDelete: 'CASCADE'})
  user: User;

  @ManyToOne(() => Blog, blog => blog.comments, {onDelete: 'CASCADE'})
  blog: Blog;
}
