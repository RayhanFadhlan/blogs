
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { TagDto } from './tag.dto';

export class CreateBlogDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsFile()
    @MaxFileSize(1024 * 1024 * 10) // 10MB
    @HasMimeType(['image/jpeg', 'image/png', 'image/jpg'])
    @IsNotEmpty({message:'image is required'})
    thumbnail: MemoryStoredFile;

    @ApiProperty({
        isArray: true,
        type: String,
    })
    @IsOptional()
    tags?: string;
}




export class CreateBlogResponseDto {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    createdAt: Date;
    updatedAt: Date;
    tags: TagDto[];

    constructor(id: number, title: string, content: string, thumbnail: string, createdAt: Date, updatedAt: Date, tags: TagDto[]) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.thumbnail = thumbnail;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.tags = tags;
    }
}
