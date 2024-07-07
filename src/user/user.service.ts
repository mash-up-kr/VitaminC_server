import { Injectable } from '@nestjs/common';

import { EntityManager, FilterQuery, rel } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { SEARCH_KEYWORD_MAX_LENGTH } from 'src/common/constants';
import {
  GroupMap,
  User,
  UserMap,
  UserMapRepository,
  UserRepository,
} from 'src/entities';
import {
  DuplicateNicknameException,
  UserNotFoundException,
  UserNotInMapException,
} from 'src/exceptions';
import { MapService } from 'src/map/map.service';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
    @InjectRepository(UserMap)
    private readonly userMapRepository: UserMapRepository,
    private readonly mapService: MapService,
    private readonly em: EntityManager,
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
    const user = await this.userRepository.findOne(id);
    if (user == undefined) {
      throw new UserNotFoundException();
    }
    Object.assign(user, updateUserDto); // Assign DTO properties to user entity
    await this.userRepository.persistAndFlush(user); // Persist changes
    return user;
    // (wrap(user) as any).assign(updateUserDto);
    // await this.userRepository.persistAndFlush(user);
    // return user;
  }

  remove(id: number) {
    return this.userRepository.nativeDelete({ id });
  }

  async checkDuplicateNickname(nickname: string) {
    const user = await this.userRepository.findOne({ nickname });
    if (user != undefined) {
      throw new DuplicateNicknameException();
    }
  }

  async saveSearchKeyword(user: User, q: string): Promise<void> {
    let updatedKeywords = user.recentSearchKeywords.filter(
      (keyword) => keyword !== q,
    );
    updatedKeywords = [q, ...updatedKeywords];
    if (updatedKeywords.length > SEARCH_KEYWORD_MAX_LENGTH) {
      updatedKeywords.pop();
    }
    user.recentSearchKeywords = updatedKeywords;
    await this.userRepository.flush();
  }

  async leaveMap(userId: number, mapId: string): Promise<void> {
    await this.em.transactional(async (em) => {
      const userJoinedUserMap = await this.userMapRepository.findOne(
        {
          map: rel(GroupMap, mapId),
          user: rel(User, userId),
        },
        { populate: ['user', 'map'] },
      );
      if (!userJoinedUserMap) {
        throw new UserNotInMapException();
      }
      this.userMapRepository.remove(userJoinedUserMap);

      const userMaps = await this.userMapRepository.find({
        map: rel(GroupMap, mapId),
      });
      if (userMaps.length === 0) {
        await this.mapService.remove(mapId);
      }
      await this.userMapRepository.flush();
    });
  }
}
