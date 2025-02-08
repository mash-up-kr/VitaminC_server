import { Injectable } from '@nestjs/common';

import { MikroORM, rel } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Point } from 'src/entities/place.point';
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
    private readonly orm: MikroORM,
  ) {}

  /**
   * map id (GroupMap.id)에 속한 장소를 전부 가져옵니다.
   * TODO: 나중에 커지면 geo-query + pagination 해야할듯
   */
  async getAllPlacesForMap({
    mapId,
    offset,
    limit,
  }: {
    mapId: string;
    offset: number;
    limit: number;
  }): Promise<PlaceForMapResponseDto[]> {
    const placesForMapList: PlaceForMap[] =
      await this.placeForMapRepository.find(
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
          orderBy: {
            createdAt: 'DESC',
          },
          offset: offset,
          limit: limit,
        },
      );
    return placesForMapList.map(
      (placeForMap: PlaceForMap) => new PlaceForMapResponseDto(placeForMap),
    );
  }

  async getAllPlaceByRadiusGeoQuery({
    mapId,
    centerX,
    centerY,
    radius,
  }: {
    mapId: string;
    centerX: number;
    centerY: number;
    radius: number;
  }): Promise<PlaceForMapResponseDto[]> {
    const placesForMapList = await this.placeForMapRepository
      .createQueryBuilder('pfm')
      .leftJoinAndSelect('pfm.place', 'place')
      .where({ map: rel(GroupMap, mapId) })
      .andWhere(
        `ST_DWithin(place.location::geography, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography, ?)`,
        [centerX, centerY, radius],
      )
      .orderBy({ 'pfm.createdAt': 'DESC' })
      .getResultList();

    await this.orm.em.populate(placesForMapList, [
      'place.kakaoPlace',
      'createdBy',
      'tags',
      'likedUser',
    ]);

    return placesForMapList.map(
      (placeForMap: PlaceForMap) => new PlaceForMapResponseDto(placeForMap),
    );
  }

  async syncLocationWithXY() {
    const em = this.orm.em.fork();
    const places = await em
      .getRepository(Place)
      .findAll({ where: { location: null } });

    for (const place of places) {
      const newLocation = new Point(place.x, place.y);
      place.location = newLocation;
    }

    await em.flush();
  }

  async findUserLikePlace(
    mapId: string,
    userId: number,
  ): Promise<PlaceForMapResponseDto[]> {
    const placeForMap: PlaceForMap[] = await this.placeForMapRepository.find(
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

    return placeForMap.map(
      (place: PlaceForMap) => new PlaceForMapResponseDto(place),
    );
  }

  async getDifference(
    mapId: string,
    userId: number,
    myId: number,
  ): Promise<string> {
    const youLike: PlaceForMap[] = await this.placeForMapRepository
      .createQueryBuilder('pfm')
      .select('pfm.place')
      .where({
        likedUser: rel(User, userId),
        map: rel(GroupMap, mapId),
      })
      .execute();

    const iLike: PlaceForMap[] = await this.placeForMapRepository
      .createQueryBuilder('pfm')
      .select('pfm.place')
      .where({
        likedUser: rel(User, myId),
        map: rel(GroupMap, mapId),
      })
      .execute();

    return (
      (iLike.filter((v: PlaceForMap) =>
        youLike.some((k: PlaceForMap): boolean => k.place === v.place),
      ).length /
        iLike.length) *
      100
    ).toFixed(1);
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
    let place: Place = await this.placeRepository.findOne({
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

    const tags: Tag[] = await this.tagRepository.find({
      name: { $in: registerPlaceDto.tagNames },
      map: rel(GroupMap, mapId),
    });

    const restTagNames = registerPlaceDto.tagNames.filter(
      (v: string) => !tags.find((k: Tag): boolean => k.name === v),
    );

    if (restTagNames.length) {
      const defaultTags: TagIcon[] = await this.tagIconRepository.find({
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

  async getPlaceByUserId(
    mapId: string,
    userId: number,
  ): Promise<PlaceForMapResponseDto[]> {
    const placeForMap: PlaceForMap[] = await this.placeForMapRepository.find(
      {
        createdBy: rel(User, userId),
        map: rel(GroupMap, mapId),
      },
      {
        populate: ['place', 'place.kakaoPlace', 'tags', 'likedUser'],
      },
    );

    return placeForMap.map(
      (place: PlaceForMap) => new PlaceForMapResponseDto(place),
    );
  }
}
