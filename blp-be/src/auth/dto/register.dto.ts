
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterRequestDto {
  
 
  @IsString({message: "name must be a string"})
  @IsNotEmpty({message: "name is required"})
  @MaxLength(255, {message: "name must be at most 255 characters"})
  name: string;

 
  @IsString({message: "username must be a string"})
  @IsNotEmpty({message: "username is required"})
  @MaxLength(255, {message: "username must be at most 255 characters"})
  username: string;

  
  @IsString({message: "password must be a string"})
  @IsNotEmpty({message: "password is required"})
  @MinLength(8, {message: "password must be at least 8 characters"})
  @MaxLength(20, {message: "password must be at most 20 characters"})
  @Matches(/^(?=.*[a-z])/, {
    message: 'Password must contain a lowercase letter',
  })
  @Matches(/^(?=.*[A-Z])/, {
    message: 'Password must contain an uppercase letter',
  })
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain a number',
  })
  password: string;
}

export class RegisterResponseDto {
  id: number;
  name: string;
  username: string;

  constructor(id: number, name: string, username: string) {
    this.id = id;
    this.name = name;
    this.username = username;
  }
}