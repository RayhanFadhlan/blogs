import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private dataSource : DataSource,
    private jwtService: JwtService
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<User | null> {
    const user = await this.dataSource.getRepository(User).findOne({
      where: { username }
    });
    if(!user){
      return null;
    }
    const isPasswordCorrect = await compare(password, user.password);
    if(!isPasswordCorrect){
      return null;
    }
    return user;
  }

  async register(
    name: string,
    username: string,
    password: string
  ) {
    const user = await this.dataSource.getRepository(User).findOne({
      where: { username }
    });
    if(user){
      throw new BadRequestException('Username already exists');
    }
    
    const hashedPassword = await hash(password, 10);
    const newUser = this.dataSource.getRepository(User).create({
      name,
      username,
      password: hashedPassword
    });
    await this.dataSource.getRepository(User).save(newUser);
    return newUser;
  }

  async login(
    username:string,
    password: string
  )  {
    console.log(username, password);
    const user = await this.validateUser(username, password);
    if(!user){
      throw new BadRequestException('Invalid username or password');
    }
    const jwtPayload = {
      id: user.id,
      username: user.username,
      name: user.name
    }
    const token = await this.jwtService.sign(jwtPayload);
    return {
      user,
      token
    }

  }

}
