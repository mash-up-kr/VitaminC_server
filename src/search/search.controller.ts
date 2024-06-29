import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiQuery({ type: String, name: 'q', description: '검색을 원하는 질의어' })
  @ApiOperation({ summary: 'q= 에 해당하는 검색어 자동완성 목록' })
  @Get('suggest')
  async searchPlace(@Query('q') q: string) {
    return await this.searchService.suggest(q);
  }

  // 위도 경도 좌표계 쿼리
  @ApiQuery({ type: String, name: 'q', description: '검색을 원하는 질의어' })
  @ApiQuery({
    type: String,
    name: 'rect',
    description: '위도경도 "x1,y1,x2,y2"',
  })
  @ApiOperation({ summary: '위도 경도 좌표계 쿼리' })
  @Get('places')
  async searchPlacesByCoord(
    @Query('q') q: string,
    @Query('rect') rect: string,
  ) {
    return await this.searchService.searchPlaceList(q, rect);
  }

  // 카카오 좌표계(wcongnamul) 쿼리
  @ApiQuery({ type: String, name: 'q', description: '검색을 원하는 질의어' })
  @ApiQuery({
    type: String,
    name: 'rect',
    description: '카카오 좌표계 위도경도 "x1,x2,y1,y2"',
  })
  @ApiOperation({ summary: '카카오 좌표계(wcongnamul) 쿼리' })
  @Get('places/kakao')
  async searchPlacesByKakaoCoord(
    @Query('q') q: string,
    @Query('rect') rect: string,
  ) {
    return await this.searchService.searchPlaceList(q, rect, {
      isKakaoCoord: true,
    });
  }

  @ApiOperation({ summary: '카카오 place에서 보내주는 장소 디테일 검색' })
  @ApiQuery({
    type: Boolean,
    name: 'invalidate',
    required: false,
    description: '장소디테일 캐시를 무효화 할지 여부 (default false)',
  })
  @Get('places/kakao/:id')
  async searchPlaceDetail(
    @Param('id') id: string,
    @Query('invalidate') invalidate: boolean = false,
  ) {
    return await this.searchService.searchPlaceDetail(id, invalidate);
  }

  // 카카오 좌표계(wcongnamul) 쿼리
  @ApiQuery({
    type: String,
    name: 'url',
    description: '쿼리에 (q와 rect)를 포함한 카카오맵 URL)',
    example:
      'https://m.map.kakao.com/actions/searchView?q=%EA%B3%B1%EC%B0%BD&wxEnc=MOSQTP&wyEnc=QNOLPRNINRR&lvl=1&rect=504945,1111188.125,506025,1111753.125&viewmap=true#!/all/list/place',
  })
  @ApiOperation({
    summary: '검색시스템 테스트용 라우트. url에 카카오맵 URL을 입력해주세요',
  })
  @Get('places/kakao-test')
  async searchPlacesByKakaoURL(@Query('url') kakaoURL: string) {
    const searchParams = new URL(decodeURIComponent(kakaoURL)).searchParams;
    const rect = searchParams.get('rect');
    const q = decodeURIComponent(searchParams.get('q'));
    return await this.searchService.searchPlaceList(q, rect, {
      isKakaoCoord: true,
    });
  }
}
