import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { UtilService } from 'src/util/util.service';

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
  ) {}

  async suggest(keyword: string): Promise<string[]> {
    const response = await this.httpService.axiosRef.get<{ items: any[] }>(
      `https://m.map.kakao.com/actions/topSuggestV2Json?q=${encodeURIComponent(keyword)}`,
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

  async searchPlaceDetail(id: string): Promise<KakaoPlaceDetailRaw> {
    const response = await this.httpService.axiosRef.get(
      `https://place.map.kakao.com/m/main/v/${id}`,
      {
        responseType: 'json',
        headers: KAKAO_SCRAPING_HEADERS,
      },
    );
    return response.data;
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
