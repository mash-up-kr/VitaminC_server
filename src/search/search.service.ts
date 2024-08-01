import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { rel } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { DEFAULT_CATEGORY_ICON_CODE } from 'src/common/constants';
import { SearchedPlaceResponseDto } from 'src/search/dtos/searched-place-response.dto';
import { UtilService } from 'src/util/util.service';

import {
  CategoryIconMappingRepository,
  GroupMap,
  KakaoPlace,
  KakaoPlaceRepository,
  PlaceForMap,
  PlaceForMapRepository,
} from '../entities';
import { KAKAO_SCRAPING_HEADERS, KakaoMapHelper } from './kakao-map.helper';
import {
  KakaoCategoryGroupCode,
  KakaoKeywordSearchParams,
  KakaoPlaceDetailRaw,
  KakaoPlaceItem,
  KakaoPlaceMenuRaw,
} from './kakao-map.types';

@Injectable()
export class SearchService {
  constructor(
    private readonly httpService: HttpService,
    private readonly kakaoMapHelper: KakaoMapHelper,
    private readonly utilService: UtilService,
    @InjectRepository(KakaoPlace)
    private readonly kakaoPlaceRepository: KakaoPlaceRepository,
    @InjectRepository(PlaceForMap)
    private readonly placeForMapRepository: PlaceForMapRepository,
    private readonly configService: ConfigService,
    private readonly categoryMappingIconRepository: CategoryIconMappingRepository,
  ) {}

  async suggest(keyword: string): Promise<string[]> {
    const response = await this.httpService.axiosRef.get<{ items: any[] }>(
      `https://m.map.kakao.com/actions/topSuggestV2Json?q=${encodeURIComponent(
        keyword,
      )}`,
      {
        responseType: 'json',
        headers: KAKAO_SCRAPING_HEADERS,
      },
    );
    return response.data.items.map((place) => place.key);
  }

  async searchPlaceList(
    query: string,
    rect: string,
    { isKakaoCoord = false }: { isKakaoCoord?: boolean } = {},
  ): Promise<SearchedPlaceResponseDto[]> {
    if (isKakaoCoord) {
      rect = await this.kakaoMapHelper.congNamulRectToLongLatRect(rect);
    }

    const [{ documents: list1 }, { documents: list2 }] = await Promise.all([
      this.searchPlace(query, rect, KakaoCategoryGroupCode['카페']),
      this.searchPlace(query, rect, KakaoCategoryGroupCode['음식점']),
    ]);
    const searchedPlaces: KakaoPlaceItem[] = this.utilService.uniqueBy(
      [...list1, ...list2],
      (item) => item.id,
    );

    const placesWithIconCode =
      await this.addCategoryIconCodeToArray(searchedPlaces);

    return placesWithIconCode.map((searchedPlace) => {
      return new SearchedPlaceResponseDto(searchedPlace);
    });
  }

  async searchPlacesWithMap(
    query: string,
    rect: string,
    mapId: string,
    { isKakaoCoord = false }: { isKakaoCoord?: boolean } = {},
  ): Promise<SearchedPlaceResponseDto[]> {
    if (isKakaoCoord) {
      rect = await this.kakaoMapHelper.congNamulRectToLongLatRect(rect);
    }

    const [{ documents: list1 }, { documents: list2 }] = await Promise.all([
      this.searchPlace(query, rect, KakaoCategoryGroupCode['카페']),
      this.searchPlace(query, rect, KakaoCategoryGroupCode['음식점']),
    ]);
    const kakaoPlaceItems: KakaoPlaceItem[] = this.utilService.uniqueBy(
      [...list1, ...list2],
      (item) => item.id,
    );
    const kakaoPlaceIds = kakaoPlaceItems.map((item) => Number(item.id));

    const existingPlacesMap = await this.getExistingPlacesMap(
      mapId,
      kakaoPlaceIds,
    );

    // TODO : 이미 등록된 장소를 중복으로 조회하지 않도록 개선 필요
    const placesWithIconCode: KakaoPlaceItem[] =
      await this.addCategoryIconCodeToArray(kakaoPlaceItems);

    const mergedPlaces = placesWithIconCode.map(
      (kakaoPlace) => existingPlacesMap[kakaoPlace.id] ?? kakaoPlace,
    );

    return mergedPlaces.map((place) => new SearchedPlaceResponseDto(place));
  }

  async getExistingPlacesMap(
    mapId: string,
    kakaoPlaceIds: number[],
  ): Promise<{ [key: string]: PlaceForMap }> {
    const existingPlaces = await this.placeForMapRepository.find(
      {
        map: rel(GroupMap, mapId),
        place: { kakaoPlace: { $in: kakaoPlaceIds } },
      },
      { populate: ['place', 'place.kakaoPlace', 'createdBy', 'tags'] },
    );

    return existingPlaces.reduce((map, placeForMap) => {
      map[placeForMap.place.kakaoPlace.id] = placeForMap;
      return map;
    }, {});
  }

  async searchPlaceDetail(
    id: string,
    invalidate: boolean,
  ): Promise<KakaoPlace> {
    let kakaoPlace = await this.kakaoPlaceRepository.findOne({
      id: Number(id),
    });

    if (
      invalidate ||
      kakaoPlace == null ||
      this.isKakaoPlaceNeedUpdate(kakaoPlace)
    ) {
      const [kakaoPlaceRaw, kakaoPlaceMenuRaw] = await Promise.all([
        this.searchPlaceDetailFromKakao(id),
        this.searchPlaceMenuFromKakao(id),
      ]);

      kakaoPlace = new KakaoPlace();
      const basicInfo = kakaoPlaceRaw.basicInfo;
      const feedback = basicInfo.feedback;
      kakaoPlace.id = basicInfo.cid;
      kakaoPlace.name = basicInfo.placenamefull;
      kakaoPlace.address = basicInfo.address.newaddr.newaddrfull;
      kakaoPlace.category = this.utilService.parseSubCategory(
        basicInfo.category.catename,
      );
      kakaoPlace.categoryIconCode = await this.getCategoryIconCode(
        basicInfo.category.catename,
      );
      kakaoPlace.blogReviewCnt = feedback.blogrvwcnt;
      kakaoPlace.commentCnt = feedback.comntcnt;
      kakaoPlace.mainPhotoUrl = basicInfo.mainphotourl;
      kakaoPlace.score = feedback.scoresum / feedback.scorecnt;
      kakaoPlace.openTimeList = (basicInfo.openHour?.periodList || []).flatMap(
        (period) => period.timeList,
      );
      kakaoPlace.offDayList = basicInfo.openHour?.offdayList || [];

      const menuPhotoMap = (kakaoPlaceMenuRaw.photoViewer?.list || []).reduce(
        (map, { summary, url }) => {
          map[summary] = url;
          return map;
        },
        {},
      );

      kakaoPlace.menuList = (kakaoPlaceRaw.menuInfo?.menuList || []).map(
        ({ menu, price }) => ({ menu, price, photo: menuPhotoMap[menu] || '' }),
      );

      // set coordinate
      const coord = await this.kakaoMapHelper.congnamulToLongLat(
        kakaoPlaceRaw.basicInfo.wpointx,
        kakaoPlaceRaw.basicInfo.wpointy,
      );
      kakaoPlace.x = coord.x;
      kakaoPlace.y = coord.y;

      // TODO: 음식사진 가져오는것도 약간 우선순위를 두면 좋을듯
      kakaoPlace.photoList = (kakaoPlaceRaw.photo?.photoList || [])
        .flatMap((photo) => photo.list || [])
        .map((photo) => photo.orgurl)
        .slice(0, 10);
      await this.kakaoPlaceRepository.upsert(kakaoPlace);
    } else {
      console.log(`kakao-place detail cache hit: ${kakaoPlace.name}}`);
    }
    return kakaoPlace;
  }

  private async searchPlaceDetailFromKakao(
    id: string,
  ): Promise<KakaoPlaceDetailRaw> {
    const response = await this.httpService.axiosRef.get<KakaoPlaceDetailRaw>(
      `https://place.map.kakao.com/main/v/${id}`,
      {
        responseType: 'json',
        headers: KAKAO_SCRAPING_HEADERS,
      },
    );
    return response.data;
  }

  private async searchPlaceMenuFromKakao(
    id: string,
  ): Promise<KakaoPlaceMenuRaw> {
    const response = await this.httpService.axiosRef.get<KakaoPlaceMenuRaw>(
      `https://place.map.kakao.com/photolist/v/${id}?type=menu`,
      {
        responseType: 'json',
        headers: KAKAO_SCRAPING_HEADERS,
      },
    );
    return response.data;
  }

  private isKakaoPlaceNeedUpdate(kakaoPlace: KakaoPlace): boolean {
    void kakaoPlace;
    // TODO: 시간이 일정이상 흐르면 다시 업데이트해야 한다고 알림
    return false;
  }

  private async searchPlace(
    query: string,
    rect: string,
    code: KakaoCategoryGroupCode,
  ): Promise<{ documents: KakaoPlaceItem[]; meta: { total_count: number } }> {
    const queryParams = {
      rect,
      query,
      category_group_code: code,
    } satisfies KakaoKeywordSearchParams;
    const response = await this.httpService.axiosRef.get(
      'https://dapi.kakao.com/v2/local/search/keyword.json',
      {
        params: queryParams,
        responseType: 'json',
        headers: {
          Authorization: `KakaoAK ${this.configService.get('KAKAO_REST_API_KEY')}`,
        },
      },
    );

    response.data.documents.forEach((document) => {
      document.category_name = this.utilService.parseSubCategory(
        document.category_name,
      );
    });
    return response.data;
  }

  private async getCategoryIconCode(category: string): Promise<number> {
    const entity = await this.categoryMappingIconRepository.findOne({
      kakaoCategory: category,
    });
    if (entity == null) return DEFAULT_CATEGORY_ICON_CODE;
    return entity.iconCode;
  }

  private async addCategoryIconCodeToArray(
    list: KakaoPlaceItem[],
  ): Promise<KakaoPlaceItem[]> {
    const uniqueCategoryList: string[] = this.utilService.getUniqueFieldValues(
      list,
      'category_name',
    );

    const categoryMappingList = await this.categoryMappingIconRepository.find({
      kakaoCategory: uniqueCategoryList,
    });

    const categoryMappingMap: Map<string, number> = new Map(
      categoryMappingList.map((mapping) => [
        mapping.kakaoCategory,
        mapping.iconCode,
      ]),
    );

    return list.map((searchedPlace: KakaoPlaceItem) => {
      searchedPlace.category_icon_code =
        categoryMappingMap.get(searchedPlace.category_name) ||
        DEFAULT_CATEGORY_ICON_CODE;
      return searchedPlace;
    });
  }
}
