import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse } from "@nestjs/swagger";
import { RegisterResponseDto } from "src/auth/dto/register.dto";
import { ResponseDto } from "src/common/dto/base-response.dto";

export function SwaggerRegister() {
  return applyDecorators(
    ApiCreatedResponse({
      content: {
        body: {
          example: ResponseDto.success(
            'User registered successfully',
            201,
            new RegisterResponseDto(
              1,
              'John Doe',
              'johndoe'
            )
          )
        }
      }
    }),
    ApiBadRequestResponse({
      content: {
        body: {
          example: ResponseDto.error(
            'Bad Request Exception',
            400,
            ["name is required", "username is required", "password is required"]
          )
        }
      }
    })
  )
}