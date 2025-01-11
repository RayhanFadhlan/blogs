import { IsString, IsNotEmpty, IsOptional, MaxLength, IsArray } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class CreateBlogDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsFile()
    @HasMimeType(['image/jpeg', 'image/png', 'image/jpg'])
    @MaxFileSize(1024 * 1024 * 10) // 10MB
    thumbnail: MemoryStoredFile;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];
}


