import { HttpService } from '@nestjs/axios';
import { Injectable, StreamableFile } from '@nestjs/common';

import { Response } from 'express';
import { map } from 'rxjs/operators';
import { isReadable } from 'stream';

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

  async proxyImage(host: string, path: string, res: Response) {
    const { data, headers, status } = await this.httpService.axiosRef.request({
      url: `https://${host}/${path}`,
      method: 'GET',
      responseType: 'stream',
      validateStatus: () => true,
      decompress: false,
    });

    for (const key in headers) {
      res.setHeader(key, headers[key]);
    }
    res.status(status);
    if (isReadable(data)) {
      return new StreamableFile(data);
    } else {
      throw new Error('Stream is not readable');
    }
  }
}
