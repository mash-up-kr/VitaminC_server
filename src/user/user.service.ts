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

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user: User = this.userRepository.create(createUserDto);
    await this.userRepository.persistAndFlush(user);
    return this.toResponseDto(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => this.toResponseDto(user));
  }

  async findOne(where: FilterQuery<User>): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne(where);
    return this.toResponseDto(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneOrFail(id);
    wrap(user).assign(updateUserDto);
    await this.userRepository.persistAndFlush(user);
    return this.toResponseDto(user);
  }

  remove(id: number) {
    return this.userRepository.nativeDelete({ id });
  }

  private toResponseDto(user: User): UserResponseDto {
    const userMap = user.userMap.getItems().map((userMap) => ({
      id: userMap.map.id,
      name: userMap.map.name,
      role: userMap.role,
    }));

    return {
      id: user.id,
      nickname: user.nickname,
      provider: user.provider,
      providerId: user.providerId,
      role: user.role,
      userMap,
    };
  }
}
