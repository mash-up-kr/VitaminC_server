import { Injectable } from '@nestjs/common';

import { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { wrap } from '@mikro-orm/postgresql';

import { CreateUserMapDto } from './dtos/create-user-map.dto';
import { UpdateUserMapDto } from './dtos/update-user-map.dto';
import { UserMap } from './entities/user-map.entity';
import { UserMapRepository } from './user-map.repository';

@Injectable()
export class UserMapService {
  constructor(
    @InjectRepository(UserMap)
    private readonly userMapRepository: UserMapRepository,
  ) {}
  // async create(createUserMapDto: CreateUserMapDto) {
  //   const userMap: UserMap = this.userMapRepository.create(createUserMapDto);
  //   await this.userMapRepository.persistAndFlush(userMap);
  //   return userMap;
  // }

  // findAll(): Promise<UserMap[]> {
  //   return this.userMapRepository.findAll();
  // }

  // findOne(where: FilterQuery<UserMap>): Promise<UserMap> {
  //   return this.userMapRepository.findOne(where);
  // }
  // async update(id: string, updateUserMapDto: UpdateUserMapDto) {
  //   const userMap = await this.userMapRepository.findOneOrFail(id);
  //   wrap(userMap).assign(updateUserMapDto);
  //   await this.userMapRepository.persistAndFlush(userMap);
  //   return userMap;
  // }

  // remove(id: string) {
  //   return this.userMapRepository.nativeDelete({ id });
  // }
}
