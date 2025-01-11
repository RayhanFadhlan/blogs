import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Tag } from './tag.entity';

@Entity('blogs')
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    title: string;

    @Column('text')
    content: string;

    @Column('text')
    thumbnail: string;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    
    @ManyToOne(() => User, user => user.blogs)
    user: User;

    @ManyToMany(() => Tag, tag => tag.blogs)
    @JoinTable({
        name: 'blog_tags',
        joinColumn: {
            name: 'blog_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'tag_id',
            referencedColumnName: 'id'
        }
    })
    tags: Tag[];

}