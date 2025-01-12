import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MemoryStoredFile } from 'nestjs-form-data';

@Injectable()
export class FileUploadService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file: MemoryStoredFile): Promise<string> {
    try {
      const uploadDir = path.join(process.cwd(), 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      // Process filename
      const fileExtension = file.originalName.split('.').pop();
      const baseFileName = file.originalName
        .replace(`.${fileExtension}`, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
      const fileName = `${baseFileName}-${uuidv4().slice(0, 8)}.${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      // Write file to disk
      await fs.writeFile(filePath, file.buffer);

      // Return full URL path
      const backendUrl = this.configService.get('BACKEND_URL') || 'http://localhost:3000';
      return `${backendUrl}/uploads/${fileName}`;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const absolutePath = path.join(process.cwd(), filePath);

      // Check if file exists
      try {
        await fs.access(absolutePath);
      } catch {
        
        return;
      }

      // Delete file
      await fs.unlink(absolutePath);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}
