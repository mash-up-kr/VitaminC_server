import { Controller, Get, Query, Response } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Response as Res } from 'express';

import { ProxyService } from 'src/proxy/proxy.service';

@ApiTags('proxy')
@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  // TODO : 한정된 도메인에 대해서만 proxy 하도록 조건 추가 필요
  @Get()
  async getKakaoImage(@Query('url') url: string, @Response() res: Res) {
    const result = await this.proxyService.fetchKakaoImage(url);

    res.setHeader('Content-Type', result.contentType);
    res.send(result.data);
  }
}
