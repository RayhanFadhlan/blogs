import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private dataSource : DataSource){}
  
}
