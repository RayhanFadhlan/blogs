import { IsNotEmpty, IsString } from "class-validator";




export class LoginRequestDto {

  @IsString({message: "name must be a string"})
  @IsNotEmpty({message: "name is required"})
  username: string;


  @IsString({message: "password must be a string"})
  @IsNotEmpty({message: "password is required"})
  password: string;
}

export class LoginResponseDto {
  id: number;
  name: string;
  username: string;
  token: string;

  constructor(id: number, name: string, username: string, token: string) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.token = token;
  }
}