import { Injectable } from '@nestjs/common';

import { rel } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import {
  GroupMap,
  KakaoPlace,
  Place,
  PlaceForMap,
  PlaceForMapRepository,
  PlaceRepository,
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
    private readonly searchService: SearchService,
  ) {}

  /**
   * map id (GroupMap.id)에 속한 장소를 전부 가져옵니다.
   * TODO: 나중에 커지면 geo-query + pagination 해야할듯
   */
  async getAllPlacesForMap({ mapId }: { mapId: string }) {
    const placesForMapList = await this.placeForMapRepository.find(
      {
        map: rel(GroupMap, mapId),
      },
      { populate: ['place', 'place.kakaoPlace', 'createdBy'] },
    );

    return placesForMapList;
  }

  async registerPlaceByKakaoId({
    kakaoPlaceId,
    mapId,
    user,
  }: {
    kakaoPlaceId: number;
    mapId: string;
    user: User;
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
    let placeForMap = await this.placeForMapRepository.findOne({
      place,
      map: rel(GroupMap, mapId),
    });

    if (placeForMap == null) {
      placeForMap = new PlaceForMap();
      placeForMap.place = place;
      placeForMap.map = rel(GroupMap, mapId);
      placeForMap.createdBy = user;
      placeForMap.comments = [];
      placeForMap.likedUserIds = [];
    }
    await this.placeForMapRepository.persistAndFlush(placeForMap);

    return placeForMap;
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
      { populate: ['place', 'place.kakaoPlace', 'createdBy'] },
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
    return placeForMap;
  }
}
