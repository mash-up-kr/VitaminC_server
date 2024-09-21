import { Injectable } from '@nestjs/common';

import { rel } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import {
  PlaceForMapConflictException,
  PlaceNotFoundException,
} from 'src/exceptions';
import { RegisterPlaceDto } from 'src/place/dto/create-tag.dto';
import {
  KakaoPlaceResponseDto,
  PlaceForMapResponseDto,
  PlaceResponseDto,
} from 'src/place/dto/place-for-map-response.dto';

import {
  GroupMap,
  KakaoPlace,
  Place,
  PlaceForMap,
  PlaceForMapRepository,
  PlaceRepository,
  Tag,
  TagIcon,
  TagIconRepository,
  TagRepository,
  User,
  UserMap,
  UserMapRepository,
  UserMapRole,
} from '../entities';
import { SearchService } from '../search/search.service';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: PlaceRepository,
    @InjectRepository(PlaceForMap)
    private readonly placeForMapRepository: PlaceForMapRepository,
    @InjectRepository(Tag)
    private readonly tagRepository: TagRepository,
    private readonly searchService: SearchService,
    @InjectRepository(TagIcon)
    private readonly tagIconRepository: TagIconRepository,
    @InjectRepository(UserMap)
    private readonly userMapRepository: UserMapRepository,
  ) {}

  /**
   * map id (GroupMap.id)에 속한 장소를 전부 가져옵니다.
   * TODO: 나중에 커지면 geo-query + pagination 해야할듯
   */
  async getAllPlacesForMap({
    mapId,
  }: {
    mapId: string;
  }): Promise<PlaceForMapResponseDto[]> {
    const placesForMapList = await this.placeForMapRepository.find(
      {
        map: rel(GroupMap, mapId),
      },
      {
        populate: [
          'place',
          'place.kakaoPlace',
          'createdBy',
          'tags',
          'likedUser',
        ],
      },
    );
    return placesForMapList.map(
      (placeForMap) => new PlaceForMapResponseDto(placeForMap),
    );
  }

  async findUserLikePlace(mapId: string, userId: number) {
    const placeForMap = await this.placeForMapRepository.find(
      {
        likedUser: rel(User, userId),
        map: rel(GroupMap, mapId),
      },
      {
        populate: [
          'place',
          'place.kakaoPlace',
          'createdBy',
          'tags',
          'likedUser',
        ],
      },
    );

    return placeForMap.map((place) => new PlaceForMapResponseDto(place));
  }

  async getDifference(mapId: string, userId: number, myId: number) {
    const youLike = await this.placeForMapRepository
      .createQueryBuilder('pfm')
      .select('pfm.place')
      .where({
        likedUser: rel(User, userId),
        map: rel(GroupMap, mapId),
      })
      .execute();

    const iLike = await this.placeForMapRepository
      .createQueryBuilder('pfm')
      .select('pfm.place')
      .where({
        likedUser: rel(User, myId),
        map: rel(GroupMap, mapId),
      })
      .execute();

    return (
      (iLike.filter((v) => youLike.some((k) => k.place === v.place)).length /
        iLike.length) *
      100
    );
  }

  async registerPlaceByKakaoId({
    kakaoPlaceId,
    mapId,
    user,
    registerPlaceDto,
  }: {
    kakaoPlaceId: number;
    mapId: string;
    user: User;
    registerPlaceDto: RegisterPlaceDto;
  }) {
    let place = await this.placeRepository.findOne({
      kakaoPlace: rel(KakaoPlace, kakaoPlaceId),
    });
    if (place === null) {
      const kakaoPlace = await this.searchService.searchPlaceDetail(
        kakaoPlaceId.toString(),
        false,
      );
      place = new Place();
      place.kakaoPlace = kakaoPlace;
      place.x = kakaoPlace.x;
      place.y = kakaoPlace.y;
    }
    await this.placeRepository.persistAndFlush(place);

    if (
      await this.placeForMapRepository.findOne({
        place,
        map: rel(GroupMap, mapId),
      })
    ) {
      throw new PlaceForMapConflictException();
    }

    const tags = await this.tagRepository.find({
      name: { $in: registerPlaceDto.tagNames },
      map: rel(GroupMap, mapId),
    });

    const restTagNames = registerPlaceDto.tagNames.filter(
      (v) => !tags.find((k) => k.name === v),
    );

    if (restTagNames.length) {
      const defaultTags = await this.tagIconRepository.find({
        name: {
          $in: restTagNames,
        },
      });

      const restTagNamesAfterDefatulTag = restTagNames
        .filter((name) => !defaultTags.find((k) => k.name === name))
        .map((name) => ({ name, iconType: null }));

      const newTags = [...defaultTags, ...restTagNamesAfterDefatulTag].map(
        (v) => {
          const tag = new Tag();
          tag.name = v.name;
          tag.iconType = v.iconType;
          tag.map = rel(GroupMap, mapId);
          tags.push(tag);

          return tag;
        },
      );

      await this.tagRepository.persistAndFlush(newTags);
    }

    const placeForMap = new PlaceForMap();
    placeForMap.place = place;
    placeForMap.map = rel(GroupMap, mapId);
    placeForMap.createdBy = user;
    placeForMap.comments = [];
    placeForMap.likedUserIds = [];
    placeForMap.tags.add(tags);

    this.placeForMapRepository.create(placeForMap);
    await this.placeForMapRepository.flush();
    return { placeId: place.id };
  }

  async getPlaceByKakaoId(mapId: string, kakaoPlaceId: number) {
    const placeForMap = await this.placeForMapRepository.findOne({
      place: { kakaoPlace: rel(KakaoPlace, kakaoPlaceId) },
      map: rel(GroupMap, mapId),
    });
    if (!placeForMap) {
      const kakaoPlaceDetail = await this.searchService.searchPlaceDetail(
        String(kakaoPlaceId),
        false,
      );
      return new KakaoPlaceResponseDto(kakaoPlaceDetail);
    }
    return await this.getPlace(mapId, placeForMap.place.id);
  }

  async getPlace(mapId: string, placeId: number): Promise<PlaceResponseDto> {
    const place = await this.placeForMapRepository.findOne(
      {
        map: rel(GroupMap, mapId),
        place: rel(Place, placeId),
      },
      {
        populate: ['place.kakaoPlace', 'tags', 'likedUser'],
        fields: [
          'likedUser.id',
          'likedUser.nickname',
          'likedUser.profileImage',
        ],
      },
    );

    if (!place) {
      throw new PlaceNotFoundException();
    }

    return new PlaceResponseDto(place as unknown as PlaceForMap);
  }

  async likePlace({
    mapId,
    placeId,
    user,
    like,
  }: {
    mapId: string;
    placeId: number;
    user: User;
    like: boolean;
  }) {
    const placeForMap = await this.placeForMapRepository.findOneOrFail(
      {
        place: rel(Place, placeId),
        map: rel(GroupMap, mapId),
      },
      {
        populate: ['place', 'likedUser.id', 'likedUser.likedPlace.place'],
      },
    );

    if (like && !placeForMap.likedUser.find((u) => u.id === user.id)) {
      placeForMap.likedUser.add(user);
    }

    if (!like && placeForMap.likedUser.find((u) => u.id === user.id)) {
      placeForMap.likedUser.remove(user);
    }

    await this.placeForMapRepository.flush();
  }

  async remove(mapId: string, placeId: number, user: User): Promise<void> {
    const placeForMap = await this.placeForMapRepository.findOne(
      {
        place: rel(Place, placeId),
        map: rel(GroupMap, mapId),
      },
      { populate: ['tags', 'createdBy'] },
    );

    if (!placeForMap) {
      throw new PlaceNotFoundException();
    }

    if (placeForMap.createdBy.id !== user.id) {
      const roleOfUserInMap = await this.userMapRepository.findOneOrFail({
        user,
        map: rel(GroupMap, mapId),
      });

      if (roleOfUserInMap.role !== UserMapRole.ADMIN) {
        throw new PlaceForMapConflictException();
      }
    }

    placeForMap.tags.removeAll();
    await this.placeForMapRepository.flush();

    await this.placeForMapRepository.removeAndFlush(placeForMap);
  }
}
