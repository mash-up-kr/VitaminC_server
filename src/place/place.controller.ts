import { Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { UseAuthGuard } from '../common/decorators/auth-guard.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User, UserRole } from '../entities';
import { PlaceService } from './place.service';

@ApiTags('place')
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @ApiOperation({ summary: '맛집지도 (GroupMap)에 등록된 장소 전부 가져오기' })
  @ApiParam({ name: 'mapId', description: '지도(GroupMap) id' })
  @Get(':mapId')
  async getAllPlaceForMap(@Param('mapId') mapId: string) {
    return await this.placeService.getAllPlacesForMap({
      mapId,
    });
  }

  @ApiOperation({ summary: '카카오 place id로 장소 등록' })
  @ApiParam({ name: 'mapId', description: '지도(GroupMap) id' })
  @ApiParam({ name: 'kakaoPlaceId', description: '카카오 place id' })
  @UseAuthGuard([UserRole.USER])
  @Put(':mapId/kakao/:kakaoPlaceId')
  async registerPlaceByKakaoId(
    @Param('mapId') mapId: string,
    @Param('kakaoPlaceId') kakaoPlaceId: number,
    @CurrentUser() user: User,
  ) {
    return await this.placeService.registerPlaceByKakaoId({
      mapId,
      kakaoPlaceId,
      user,
    });
  }

  @ApiOperation({ summary: '맛집 장소 삭제' })
  @ApiParam({ name: 'mapId', description: '지도(GroupMap) id' })
  @ApiParam({ name: 'placeId', description: 'place id' })
  @UseAuthGuard([UserRole.USER])
  @Delete(':mapId/:placeId')
  async deletePlaceByKakaoId(
    @Param('mapId') mapId: string,
    @Param('placeId') placeId: number,
    @CurrentUser() user: User,
  ) {
    // TODO:
    throw new Error('Not implemented');
  }

  @ApiOperation({ summary: '맛집 좋아요' })
  @ApiParam({ name: 'mapId', description: '지도(GroupMap) id' })
  @ApiParam({ name: 'placeId', description: 'place id' })
  @UseAuthGuard([UserRole.USER])
  @Put(':mapId/:placeId/like')
  async likePlace(
    @Param('mapId') mapId: string,
    @Param('placeId') placeId: number,
    @CurrentUser() user: User,
  ) {
    return await this.placeService.likePlace({
      mapId,
      placeId,
      user,
      like: true,
    });
  }

  @ApiOperation({ summary: '맛집 좋아요 취소' })
  @ApiParam({ name: 'mapId', description: '지도(GroupMap) id' })
  @ApiParam({ name: 'placeId', description: 'place id' })
  @UseAuthGuard([UserRole.USER])
  @Delete(':mapId/:placeId/like')
  async dislikePlace(
    @Param('mapId') mapId: string,
    @Param('placeId') placeId: number,
    @CurrentUser() user: User,
  ) {
    // TODO:
    return await this.placeService.likePlace({
      mapId,
      placeId,
      user,
      like: false,
    });
  }
}
