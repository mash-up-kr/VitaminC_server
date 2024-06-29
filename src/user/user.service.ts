import { Injectable } from '@nestjs/common';

import { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { User, UserRepository } from 'src/entities';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

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
    const users = await this.userRepository.findAll({ populate: ['userMap'] });
    return users;
  }

  async findOne(where: FilterQuery<User>) {
    const user = await this.userRepository.findOne(where);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneOrFail(id);
    // TODO: 다시 구현
    // (wrap(user) as any).assign(updateUserDto);
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  remove(id: number) {
    return this.userRepository.nativeDelete({ id });
  }
}
