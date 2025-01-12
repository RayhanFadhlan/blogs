import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { LoginResponseDto } from "src/auth/dto/login.dto";
import { ResponseDto } from "src/common/dto/base-response.dto";

export function SwaggerLogin() {
  return applyDecorators(
    ApiOkResponse({
      content: {
        body: {
          example: ResponseDto.success(
            'User logged in successfully',
            200,
            new LoginResponseDto
            (
              1,
              'John Doe',
              'johndoe',
              "1234567890"
            )
          )
        }
      }
    })
  )
}