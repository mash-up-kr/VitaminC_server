import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';

import { UtilService } from 'src/util/util.service';

import { KakaoPlace, KakaoPlaceRepository } from '../entities';
import { KAKAO_SCRAPING_HEADERS, KakaoMapHelper } from './kakao-map.helper';
import {
  KakaoCategoryGroupCode,
  KakaoKeywordSearchParams,
  KakaoPlaceDetailRaw,
  KakaoPlaceItem,
} from './kakao-map.types';

@Injectable()
export class SearchService {
  constructor(
    private readonly httpService: HttpService,
    private readonly kakaoMapHelper: KakaoMapHelper,
    private readonly utilService: UtilService,
    @InjectRepository(KakaoPlace)
    private readonly kakaoPlaceRepository: KakaoPlaceRepository,
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
  ): Promise<KakaoPlaceItem[]> {
    if (isKakaoCoord) {
      rect = await this.kakaoMapHelper.congNamulRectToLongLatRect(rect);
    }

    const [{ documents: list1 }, { documents: list2 }] = await Promise.all([
      this.searchPlace(query, rect, KakaoCategoryGroupCode['카페']),
      this.searchPlace(query, rect, KakaoCategoryGroupCode['음식점']),
    ]);
    return this.utilService.uniqueBy([...list1, ...list2], (item) => item.id);
  }

  async searchPlaceDetail(
    id: string,
    invalidate: boolean,
  ): Promise<KakaoPlace> {
    let kakaoPlace = await this.kakaoPlaceRepository.findOne({
      id: Number(id),
    }); //

    if (
      invalidate ||
      kakaoPlace == null ||
      this.isKakaoPlaceNeedUpdate(kakaoPlace)
    ) {
      const kakaoPlaceRaw = await this.searchPlaceDetailFromKakao(id);
      kakaoPlace ??= new KakaoPlace();
      kakaoPlace.id = kakaoPlaceRaw.basicInfo.cid;
      kakaoPlace.name = kakaoPlaceRaw.basicInfo.placenamefull;
      kakaoPlace.address = kakaoPlaceRaw.basicInfo.placenamefull;
      kakaoPlace.category = kakaoPlaceRaw.basicInfo.category.cate1name;
      kakaoPlace.menuList = kakaoPlaceRaw.menuInfo.menuList.map(
        ({ menu, price }) => ({ menu, price }),
      );

      // set coordinate
      const coord = await this.kakaoMapHelper.congnamulToLongLat(
        kakaoPlaceRaw.basicInfo.wpointx,
        kakaoPlaceRaw.basicInfo.wpointy,
      );
      kakaoPlace.x = coord.x;
      kakaoPlace.y = coord.y;

      // TODO: 음식사진 가져오는것도 약간 우선순위를 두면 좋을듯
      kakaoPlace.photoList = kakaoPlaceRaw.photo.photoList
        .flatMap((photo) => photo.list)
        .map((photo) => photo.orgurl)
        .slice(0, 10);

      await this.kakaoPlaceRepository.persistAndFlush(kakaoPlace);
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
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      },
    );

    return response.data;
  }
}
