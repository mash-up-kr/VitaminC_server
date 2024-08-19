import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { ProxyService } from 'src/proxy/proxy.service';

@ApiTags('proxy')
@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get(':host/:path(*)')
  async getProxyImage(
    @Res({ passthrough: true }) res: Response,
    @Param('host') host: string,
    @Param('path') path: string,
  ) {
    return await this.proxyService.proxyImage(host, path, res);
  }

  // TODO : 한정된 도메인에 대해서만 proxy 하도록 조건 추가 필요
  @Get()
  async getKakaoImage(@Query('url') url: string, @Res() res: Response) {
    const result = await this.proxyService.fetchKakaoImage(url);

    res.setHeader('Content-Type', result.contentType);
    res.send(result.data);
  }
}
