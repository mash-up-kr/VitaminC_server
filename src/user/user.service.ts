import { Injectable } from '@nestjs/common';

import { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { wrap } from '@mikro-orm/postgresql';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user: User = this.userRepository.create(createUserDto);
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  async findAll() {
    const users = await this.userRepository.findAll();
    return users;
  }

  async findOne(where: FilterQuery<User>) {
    const user = await this.userRepository.findOne(where);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneOrFail(id);
    wrap(user).assign(updateUserDto);
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  remove(id: number) {
    return this.userRepository.nativeDelete({ id });
  }
}
