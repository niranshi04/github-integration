import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private UsersRepository: Repository<Users>,
    ) { }

    public async create(user: Users): Promise<Users> {
        return await this.UsersRepository.save(user);
    }
}