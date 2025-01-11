import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Blog } from './blog.entity';
import { Exclude } from 'class-transformer';
@Entity('tags')
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => Blog, blog => blog.tags)
    @Exclude()
    blogs: Blog[];
}