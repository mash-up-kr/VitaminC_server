import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

export enum CategoryGroupCode {
  '대형마트' = 'MT1',
  '편의점' = 'CS2',
  '어린이집, 유치원' = 'PS3',
  '학교' = 'SC4',
  '학원' = 'AC5',
  '주차장' = 'PK6',
  '주유소, 충전소' = 'OL7',
  '지하철역' = 'SW8',
  '은행' = 'BK9',
  '문화시설' = 'CT1',
  '중개업소' = 'AG2',
  '공공기관' = 'PO3',
  '관광명소' = 'AT4',
  '숙박' = 'AD5',
  '음식점' = 'FD6',
  '카페' = 'CE7',
  '병원' = 'HP8',
  '약국' = 'PM9',
}

export interface KakaoKeywordSearchParams {
  query: string; // 검색을 원하는 질의어
  category_group_code?: CategoryGroupCode; // 카테고리 그룹 코드, 카테고리로 결과 필터링을 원하는 경우 사용
  x?: string; // 중심 좌표의 X 혹은 경도(longitude) 값
  y?: string; // 중심 좌표의 Y 혹은 위도(latitude) 값
  radius?: number; // 중심 좌표부터의 반경거리 (미터(m), 최소: 0, 최대: 20000). 특정 지역을 중심으로 검색하려면 x, y와 함께 사용
  rect?: string; // 사각형의 지정 범위 내 제한 검색을 위한 좌표 (좌측 X 좌표, 좌측 Y 좌표, 우측 X 좌표, 우측 Y 좌표 형식)
  page?: number; // 결과 페이지 번호 (최소: 1, 최대: 45, 기본값: 1)
  size?: number; // 한 페이지에 보여질 문서의 개수 (최소: 1, 최대: 15, 기본값: 15)
  sort?: 'distance' | 'accuracy'; // 결과 정렬 순서 (distance 정렬을 원할 때는 기준 좌표로 쓰일 x, y와 함께 사용, 기본값: accuracy)
}

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService) {}
  async search() {
    return [];
  }

  async suggest(keyword: string): Promise<string[]> {
    const response = await this.httpService.axiosRef.get<{ items: any[] }>(
      `https://m.map.kakao.com/actions/topSuggestV2Json?q=${encodeURIComponent(keyword)}`,
      {
        responseType: 'json',
        headers: {
          Accept: 'application/json, text/javascript, */*; q=0.01',
          'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Priority: 'u=1, i',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
          'X-Requested-With': 'XMLHttpRequest',
        },
      },
    );
    return response.data.items.map((place) => place.key);
  }
}

// (async () => {
//   const queryParams = {
//     query: '카페',
//     category_group_code: CategoryGroupCode['카페'],
//     rect: '504592.5,1112392.5,505567.5,1114282.5',
//   } satisfies KakaoKeywordSearchParams;
//   const response = await axios.get(
//     'https://dapi.kakao.com/v2/local/search/keyword.json?',
//     {
//       params: queryParams,
//       responseType: 'json',
//       headers: {
//         Authorization: `KakaoAK ${API_KEY}`,
//       },
//     },
//   );

//   console.log(response.data);
// })();
