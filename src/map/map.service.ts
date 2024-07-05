import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  FilterQuery,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { InjectEntityManager, InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { v4 as uuidv4 } from 'uuid';

import {
  GroupMap,
  GroupMapRepository,
  Place,
  PlaceForMap,
  PlaceForMapRepository,
  PlaceRepository,
  User,
  UserMap,
  UserMapRepository,
  UserMapRole,
} from 'src/entities';

import { CreateMapDto } from './dtos/create-map.dto';
import { MapItemForUserDto } from './dtos/map-item-for-user.dto';
import { MapResponseDto } from './dtos/map-response.dto';
import { UpdateMapDto } from './dtos/update-map.dto';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(GroupMap)
    private readonly mapRepository: GroupMapRepository,
    @InjectRepository(UserMap)
    private readonly userMapRepository: UserMapRepository,
    @InjectRepository(PlaceForMap)
    private readonly placeForMapRepository: PlaceForMapRepository,
  ) {}

  async create(
    createMapDto: CreateMapDto,
    by: User,
  ): Promise<MapItemForUserDto> {
    try {
      const map = this.mapRepository.create(createMapDto);
      const userMap = this.userMapRepository.create({
        user: by,
        role: UserMapRole.ADMIN,
        map,
      });
      this.mapRepository.persist(map);
      this.userMapRepository.persist(userMap);

      await this.mapRepository.flush();
      // await this.userMapRepository.flush(); // 이거 왜 안하지?

      const mapItemForUser = new MapItemForUserDto();
      mapItemForUser.id = map.id;
      mapItemForUser.name = map.name;
      mapItemForUser.createdAt = map.createdAt;
      mapItemForUser.updatedAt = map.updatedAt;
      mapItemForUser.role = userMap.role;

      return mapItemForUser;
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new BadRequestException('이미 존재하는 지도 이름입니다');
      }
      throw error;
    }
  }

  /**
   * 사용자가 속한 그룹의 맵을 모두 가져옵니다.
   */
  async findAll(user: User): Promise<MapItemForUserDto[]> {
    const userMapList = await this.userMapRepository.find(
      { user: user },
      { populate: ['map'] },
    );

    // populate
    return userMapList.map(({ map, role }) => {
      const mapItemForUser = new MapItemForUserDto();
      mapItemForUser.id = map.id;
      mapItemForUser.name = map.name;
      mapItemForUser.createdAt = map.createdAt;
      mapItemForUser.updatedAt = map.updatedAt;
      mapItemForUser.role = role;
      return mapItemForUser;
    });
  }

  async findOne(where: FilterQuery<GroupMap>): Promise<MapResponseDto> {
    const entity = await this.mapRepository.findOne(where, {
      populate: ['userMap'],
    });
    if (entity === null) {
      throw new NotFoundException('해당 맵을 찾을 수 없습니다');
    }
    const placeForMap = await this.placeForMapRepository.find({ map: where });
    const mapResponse = new MapResponseDto();
    mapResponse.id = entity.id;
    mapResponse.name = entity.name;
    mapResponse.createdAt = entity.createdAt;
    mapResponse.updatedAt = entity.updatedAt;
    mapResponse.registeredPlaceCount = placeForMap.length;
    mapResponse.users = entity.userMap.getItems().map((userMap) => {
      return {
        id: userMap.user.id,
        role: userMap.role,
        nickname: userMap.user.nickname,
      };
    });

    return mapResponse;
  }

  async update(id: string, updateMapDto: UpdateMapDto) {
    const map = await this.mapRepository.findOneOrFail(id);
    // TODO: 이거 다시 구현
    await this.mapRepository.persistAndFlush(map);
    return map;
  }

  remove(id: string) {
    return this.mapRepository.nativeDelete({ id });
  }
}
