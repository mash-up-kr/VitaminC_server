import { Injectable, NotFoundException } from '@nestjs/common';

import { FilterQuery, rel } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import {
  GroupMap,
  GroupMapRepository,
  PlaceForMap,
  PlaceForMapRepository,
  User,
  UserMap,
  UserMapRepository,
  UserMapRole,
} from 'src/entities';
import { Tag } from 'src/entities/tag.entity';
import { TagRepository } from 'src/entities/tag.repository';
import { TagNotFoundException } from 'src/exceptions';
import { CreateTagDto } from 'src/map/dtos/create-tag.dto';
import { TagResponseDto } from 'src/map/dtos/tag-response.dto';

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
    @InjectRepository(Tag)
    private readonly tagRepository: TagRepository,
  ) {}

  async create(
    createMapDto: CreateMapDto,
    by: User,
  ): Promise<MapItemForUserDto> {
    const map = this.mapRepository.create(createMapDto);
    const userMap = this.userMapRepository.create({
      user: by,
      role: UserMapRole.ADMIN,
      map,
    });
    this.mapRepository.persist(map);
    this.userMapRepository.persist(userMap);

    await this.mapRepository.flush();

    const mapItemForUser = new MapItemForUserDto();
    mapItemForUser.id = map.id;
    mapItemForUser.name = map.name;
    mapItemForUser.createdAt = map.createdAt;
    mapItemForUser.updatedAt = map.updatedAt;
    mapItemForUser.role = userMap.role;

    return mapItemForUser;
  }

  /**
   * 사용자가 속한 그룹의 맵을 모두 가져옵니다.
   */
  async findAll(user: User): Promise<MapItemForUserDto[]> {
    const userMapList = await this.userMapRepository.find(
      { user: user },
      { populate: ['map'] },
    );

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
      populate: ['userMap.user'],
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
    const map = await this.mapRepository.findOne(id);
    if (!map) {
      throw new NotFoundException(`존재하지 않는 지도입니다.`);
    }

    Object.assign(map, updateMapDto);

    await this.mapRepository.persistAndFlush(map);
    return map;
  }

  async remove(id: string) {
    this.placeForMapRepository.nativeDelete({ map: rel(GroupMap, id) });
    this.mapRepository.nativeDelete({ id: id });
    this.tagRepository.nativeDelete({ map: rel(GroupMap, id) });
    await this.mapRepository.flush();
  }
  async findTagByMapId(mapId: string): Promise<TagResponseDto[]> {
    const tags = await this.tagRepository.find({
      $or: [{ map: rel(GroupMap, mapId) }, { map: null }],
    });
    return tags.map((tag) => new TagResponseDto(tag));
  }

  async createTag(
    mapId: string,
    createTagDto: CreateTagDto,
  ): Promise<TagResponseDto> {
    const tag = this.tagRepository.create({
      map: rel(GroupMap, mapId),
      ...createTagDto,
    });
    await this.tagRepository.persistAndFlush(tag);

    return new TagResponseDto(tag);
  }

  async removeTag(mapId: string, tagId: number) {
    const tag = await this.tagRepository.findOne({
      map: rel(GroupMap, mapId),
      id: tagId,
    });
    if (!tag) {
      throw new TagNotFoundException();
    }
    await this.tagRepository.removeAndFlush(tag);
  }
}
