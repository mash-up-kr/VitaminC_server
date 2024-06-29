import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import {
  KakaoCoordinateConversionParams,
  KakaoCoordinateSystem,
} from './kakao-map.types';

@Injectable()
export class KakaoMapHelper {
  constructor(private readonly httpService: HttpService) {}

  async congNamulRectToLongLatRect(rect: string): Promise<string> {
    const [x1, y1, x2, y2] = rect.split(',');

    const [leftTop, rightBottom] = await Promise.all([
      this.congnamulToLongLat(x1, y1),
      this.congnamulToLongLat(x2, y2),
    ]);

    return `${leftTop.x},${leftTop.y},${rightBottom.x},${rightBottom.y}`;
  }

  async congnamulToLongLat(
    x: string | number,
    y: string | number,
  ): Promise<{ x: number; y: number }> {
    const queryParams: KakaoCoordinateConversionParams = {
      x: Number(x),
      y: Number(y),
      input_coord: KakaoCoordinateSystem.WCONGNAMUL,
      output_coord: KakaoCoordinateSystem.WGS84,
    };

    const response = await this.httpService.axiosRef.get(
      'https://dapi.kakao.com/v2/local/geo/transcoord.json',
      {
        params: queryParams,
        responseType: 'json',
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      },
    );

    return response.data.documents[0];
  }
}

export const KAKAO_SCRAPING_HEADERS = {
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
};
