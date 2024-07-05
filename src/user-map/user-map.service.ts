import { Injectable, NotFoundException } from '@nestjs/common';

import { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { UserMap, UserMapRepository } from 'src/entities';

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
  //
  // findOne(where: FilterQuery<UserMap>): Promise<UserMap> {
  //   return this.userMapRepository.findOne(where);
  // }

  async findOneByUserAndMap(userId: number, mapId: string): Promise<UserMap> {
    const where: FilterQuery<UserMap> = {
      user: { id: userId },
      map: { id: mapId },
    };

    const userMap = await this.userMapRepository.findOne(where);
    if (!userMap) {
      throw new NotFoundException('해당 유저는 해당 지도의 멤버가 아닙니다.');
    }
    return userMap;
  }
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
