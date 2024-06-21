import { Injectable } from '@nestjs/common';

import { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { wrap } from '@mikro-orm/postgresql';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: UsersRepository,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user: User = this.usersRepository.create(createUserDto);
    await this.usersRepository.persistAndFlush(user);
    return user;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  findOne(where: FilterQuery<User>): Promise<User> {
    return this.usersRepository.findOne(where);
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneOrFail(id);
    wrap(user).assign(updateUserDto);
    await this.usersRepository.persistAndFlush(user);
    return user;
  }

  remove(id: number) {
    return this.usersRepository.nativeDelete({ id });
  }
}
