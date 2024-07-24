import { Injectable } from '@nestjs/common';

import { rel } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { PlaceNotFoundException } from 'src/exceptions';
import { RegisterPlaceDto } from 'src/place/dto/create-tag.dto';
import {
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
  TagRepository,
  User,
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
      { populate: ['place', 'place.kakaoPlace', 'createdBy', 'tags'] },
    );
    return placesForMapList.map(
      (placeForMap) => new PlaceForMapResponseDto(placeForMap),
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
    // create place if not exist
    let place = await this.placeRepository.findOne({
      kakaoPlace: rel(KakaoPlace, kakaoPlaceId),
    });
    if (place == null) {
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

    // create place for map if not exist
    const placeForMap = await this.placeForMapRepository.findOne({
      place,
      map: rel(GroupMap, mapId),
    });
    if (placeForMap == null) {
      const tags = await this.tagRepository.find({
        id: { $in: registerPlaceDto.tagIds },
      });
      this.placeForMapRepository.create({
        place,
        tags,
        map: rel(GroupMap, mapId),
        createdBy: user,
        comments: [],
        likedUserIds: [],
      });
      await this.placeForMapRepository.flush();
    }
    return { placeId: place.id };
  }

  async findOne({
    mapId,
    placeId,
  }: {
    mapId: string;
    placeId: number;
  }): Promise<PlaceResponseDto> {
    const place = await this.placeForMapRepository.findOne(
      {
        map: rel(GroupMap, mapId),
        place: rel(Place, placeId),
      },
      { populate: ['place.kakaoPlace', 'tags'] },
    );
    if (!place) {
      throw new PlaceNotFoundException();
    }

    return new PlaceResponseDto(place);
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
      { populate: ['place', 'place.kakaoPlace', 'createdBy', 'tags'] },
    );

    if (like && !placeForMap.likedUserIds.includes(user.id)) {
      placeForMap.likedUserIds = [...placeForMap.likedUserIds, user.id];
    }

    if (!like && placeForMap.likedUserIds.includes(user.id)) {
      placeForMap.likedUserIds = placeForMap.likedUserIds.filter(
        (id) => id !== user.id,
      );
    }

    await this.placeForMapRepository.persistAndFlush(placeForMap);
  }

  async remove(mapId: string, placeId: number): Promise<void> {
    const placeForMap = await this.placeForMapRepository.findOne({
      place: rel(Place, placeId),
      map: rel(GroupMap, mapId),
    });
    if (!placeForMap) {
      throw new PlaceNotFoundException();
    }
    await this.placeForMapRepository.removeAndFlush(placeForMap);
  }
}
