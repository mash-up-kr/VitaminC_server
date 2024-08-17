import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { map } from 'rxjs/operators';

@Injectable()
export class ProxyService {
  constructor(private readonly httpService: HttpService) {}

  // 카카오 API로부터 이미지를 가져오는 메서드
  async fetchKakaoImage(url: string): Promise<any> {
    return this.httpService
      .get(url, { responseType: 'arraybuffer' })
      .pipe(
        map((response) => ({
          data: response.data,
          contentType: response.headers['content-type'],
        })),
      )
      .toPromise();
  }
}
