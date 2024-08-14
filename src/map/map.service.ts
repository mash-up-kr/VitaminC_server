import { Injectable } from '@nestjs/common';

import { FilterQuery, rel } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { INVITE_LINK_PREVIEW_LENGTH } from 'src/common/constants';
import {
  GroupMap,
  GroupMapRepository,
  PlaceForMap,
  PlaceForMapRepository,
  TagIcon,
  TagIconRepository,
  User,
  UserMap,
  UserMapRepository,
  UserMapRole,
  UserMapRoleValueType,
} from 'src/entities';
import { Tag } from 'src/entities/tag.entity';
import { TagRepository } from 'src/entities/tag.repository';
import {
  DuplicateTagException,
  MapNotFoundException,
  TagNotFoundException,
  UserMapConflictException,
  UserMapNotFoundException,
} from 'src/exceptions';
import { CreateTagDto } from 'src/map/dtos/create-tag.dto';
import { TagResponseDto } from 'src/map/dtos/tag-response.dto';
import { UtilService } from 'src/util/util.service';

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
    @InjectRepository(TagIcon)
    private readonly tagIconRepository: TagIconRepository,
    private readonly utilService: UtilService,
  ) {}

  async create(
    createMapDto: CreateMapDto,
    by: User,
  ): Promise<MapItemForUserDto> {
    const map: GroupMap = this.mapRepository.create({
      ...createMapDto,
      createBy: by,
    });
    const userMap: UserMap = this.userMapRepository.create({
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
      { populate: ['map'], orderBy: { createdAt: 'DESC' } },
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
      populate: ['userMap.user', 'createBy'],
    });
    if (entity === null) {
      throw new MapNotFoundException();
    }
    const placeForMap = await this.placeForMapRepository.find({ map: where });
    return new MapResponseDto(entity, placeForMap);
  }

  async update(id: string, updateMapDto: UpdateMapDto) {
    const map = await this.mapRepository.findOne(id);
    if (!map) {
      throw new MapNotFoundException();
    }

    Object.assign(map, updateMapDto);

    await this.mapRepository.persistAndFlush(map);
    return map;
  }

  async remove(id: string) {
    await this.placeForMapRepository.nativeDelete({ map: rel(GroupMap, id) });
    await this.mapRepository.nativeDelete({ id: id });
    await this.tagRepository.nativeDelete({ map: rel(GroupMap, id) });
    await this.mapRepository.flush();
  }
  async findTagByMapId(mapId: string): Promise<TagResponseDto[]> {
    const tags = await this.tagRepository.find({
      map: rel(GroupMap, mapId),
    });

    const defaultTags: Pick<Tag, 'name' | 'iconType'>[] =
      await this.tagIconRepository.findAll();

    const uniqueTags = this.utilService.uniqueBy(
      [...defaultTags, ...tags],
      (t) => t.name,
    );

    return uniqueTags.map((tag) => new TagResponseDto(tag));
  }

  async createTag(
    mapId: string,
    createTagDto: CreateTagDto,
  ): Promise<TagResponseDto> {
    const entity = await this.tagRepository.findOne({
      map: rel(GroupMap, mapId),
      name: createTagDto.name,
    });

    const tagIcon = await this.tagIconRepository.findOne({
      name: createTagDto.name,
    });

    if (entity || tagIcon) {
      throw new DuplicateTagException();
    }

    const tag = this.tagRepository.create({
      map: rel(GroupMap, mapId),
      ...createTagDto,
      iconType: tagIcon ? tagIcon.iconType : null,
    });
    await this.tagRepository.persistAndFlush(tag);

    return new TagResponseDto(tag);
  }

  async removeTag(mapId: string, name: string) {
    const tag = await this.tagRepository.findOne({
      map: rel(GroupMap, mapId),
      name,
    });
    if (!tag) {
      throw new TagNotFoundException();
    }
    await this.tagRepository.removeAndFlush(tag);
  }

  async createUserMap(user: User, map: GroupMap, role?: UserMapRoleValueType) {
    const existUserMap = await this.userMapRepository.findOne({
      user: user,
      map: map,
    });
    if (existUserMap != null) {
      throw new UserMapConflictException();
    }

    this.userMapRepository.create({
      user: user,
      map: map,
      role: role || UserMapRole.WRITE,
    });
    await this.userMapRepository.flush();
  }

  async findUserMap(userId: number, mapId: string): Promise<UserMap> {
    const where: FilterQuery<UserMap> = {
      user: { id: userId },
      map: { id: mapId },
    };

    const userMap = await this.userMapRepository.findOne(where);
    if (!userMap) {
      throw new UserMapNotFoundException();
    }
    return userMap;
  }

  async getPlacesPreview(map: GroupMap): Promise<string[]> {
    const placesForMapList = await this.placeForMapRepository.find(
      { map },
      {
        populate: ['place', 'place.kakaoPlace', 'createdBy'],
        orderBy: { createdAt: 'desc' },
      },
    );
    const subList = placesForMapList.slice(0, INVITE_LINK_PREVIEW_LENGTH);
    return subList.map((item) => {
      const photoList = item.place.kakaoPlace.photoList;
      if (photoList.length > 0) {
        return photoList[0];
      }
    });
  }
}
