import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { RegisterRequestDto, RegisterResponseDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { ResponseMessage } from "src/common/decorator/response-message.decorator";
import { ApiTags } from "@nestjs/swagger";
import { SwaggerRegister } from "src/swagger/register";
import { LoginRequestDto, LoginResponseDto } from "./dto/login.dto";
import { SwaggerLogin } from "src/swagger/login";



@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private auths: AuthService) {}

  @Post('register')
  @ResponseMessage('User registered successfully')
  @SwaggerRegister()
  async register(@Body() body: RegisterRequestDto) : Promise<RegisterResponseDto> {
    const res = await this.auths.register(body.name, body.username, body.password);
    return {
      id: res.id,
      name: res.name,
      username: res.username
    }
  }

  @Post('login')
  @ResponseMessage('User logged in successfully')
  @HttpCode(200)
  @SwaggerLogin()
  async login(@Body() body: LoginRequestDto) : Promise<LoginResponseDto>{
    const res = await this.auths.login(body.username, body.password);
    return {
      id: res.user.id,
      name: res.user.name,
      username: res.user.username,
      token: res.token
    }
  }
}