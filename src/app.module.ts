import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import typeormConfig from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { CommentsModule } from './comments/comments.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    NestjsFormDataModule.config({ storage: MemoryStoredFile, isGlobal: true }),
    UsersModule,
    AuthModule,
    BlogsModule,
    CommentsModule,
  ],
})
export class AppModule {}
