import { Module } from "@nestjs/common";
import { AuthService } from './auth.service';
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
@Module
({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  controllers:[AuthController],
  providers: [AuthService],
  
})
export class AuthModule{}