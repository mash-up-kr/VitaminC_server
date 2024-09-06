import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { UseMapRoleGuard } from 'src/common/decorators/map-role-guard.decorator';
import { RegisterPlaceDto } from 'src/place/dto/create-tag.dto';
import {
  KakaoPlaceResponseDto,
  PlaceForMapResponseDto,
  PlaceResponseDto,
} from 'src/place/dto/place-for-map-response.dto';

import { UseAuthGuard } from '../common/decorators/auth-guard.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User, UserMapRole } from '../entities';
import { PlaceService } from './place.service';

@ApiTags('place')
@ApiBearerAuth()
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @ApiOperation({ summary: '맛집지도 (GroupMap)에 등록된 장소 전부 가져오기' })
  @ApiParam({ name: 'mapId', description: '지도(GroupMap) id' })
  @ApiResponse({ type: PlaceForMapResponseDto, isArray: true })
  @UseMapRoleGuard([UserMapRole.ADMIN, UserMapRole.WRITE, UserMapRole.READ])
  @UseAuthGuard()
  @Get(':mapId')
  async getAllPlaceForMap(@Param('mapId') mapId: string) {
    return await this.placeService.getAllPlacesForMap({
      mapId,
    });
  }

  @ApiOperation({ summary: '카카오 place id로 장소 등록' })
  @ApiParam({ name: 'mapId', description: '지도(GroupMap) id' })
  @ApiParam({ name: 'kakaoPlaceId', description: '카카오 place id' })
  @UseMapRoleGuard([UserMapRole.ADMIN, UserMapRole.WRITE])
  @UseAuthGuard()
  @Post(':mapId/kakao/:kakaoPlaceId')
  async registerPlaceByKakaoId(
    @Param('mapId') mapId: string,
    @Param('kakaoPlaceId') kakaoPlaceId: number,
    @Body() registerPlaceDto: RegisterPlaceDto,
    @CurrentUser() user: User,
  ) {
    return await this.placeService.registerPlaceByKakaoId({
      mapId,
      kakaoPlaceId,
      user,
      registerPlaceDto: registerPlaceDto,
    });
  }

  @ApiOperation({
    summary:
      'kakaoId를 통해 place 상세 조회(장소 등록 여부에 따라 kakaoPlace, Place 상세 정보 반환)',
  })
  @ApiParam({ name: 'mapId', description: '지도(GroupMap) id' })
  @ApiParam({ name: 'kakaoPlaceId', description: '카카오 place id' })
  @UseAuthGuard()
  @ApiResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(PlaceResponseDto) },
        { $ref: getSchemaPath(KakaoPlaceResponseDto) },
      ],
    },
  })
  @Get(':mapId/kakao/:kakaoPlaceId')
  async getPlaceByKakaoId(
    @Param('mapId') mapId: string,
    @Param('kakaoPlaceId') kakaoPlaceId: number,
  ): Promise<KakaoPlaceResponseDto> {
    return await this.placeService.getPlaceByKakaoId(mapId, kakaoPlaceId);
  }

  @ApiOperation({ summary: '저장된 place id로 장소 조회' })
  @ApiParam({ name: 'mapId', description: '지도(GroupMap) id' })
  @ApiParam({ name: 'placeId', description: '등록된 place id' })
  @ApiResponse({ type: PlaceResponseDto })
  @UseAuthGuard()
  @Get(':mapId/:placeId')
  async getPlaceInMap(
    @Param('mapId') mapId: string,
    @Param('placeId') placeId: number,
  ) {
    return await this.placeService.getPlace(mapId, placeId);
  }

  @ApiOperation({ summary: '맛집 장소 삭제' })
  @ApiParam({ name: 'mapId', description: '지도(GroupMap) id' })
  @ApiParam({ name: 'placeId', description: 'place id' })
  @UseMapRoleGuard([UserMapRole.ADMIN, UserMapRole.WRITE])
  @UseAuthGuard()
  @Delete(':mapId/:placeId')
  async deletePlaceByKakaoId(
    @Param('mapId') mapId: string,
    @Param('placeId') placeId: string,
    @CurrentUser() user: User,
  ) {
    await this.placeService.remove(mapId, +placeId, user);
  }

  @ApiOperation({ summary: '맛집 좋아요' })
  @ApiParam({ name: 'mapId', description: '지도(GroupMap) id' })
  @ApiParam({ name: 'placeId', description: 'place id' })
  @UseMapRoleGuard()
  @UseAuthGuard()
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
  @UseMapRoleGuard()
  @UseAuthGuard()
  @Delete(':mapId/:placeId/like')
  async dislikePlace(
    @Param('mapId') mapId: string,
    @Param('placeId') placeId: number,
    @CurrentUser() user: User,
  ) {
    return await this.placeService.likePlace({
      mapId,
      placeId,
      user,
      like: false,
    });
  }
}
