import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UseAuthGuard } from '../common/decorators/auth-guard.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User, UserRole } from '../entities';
import { CreateMapDto } from './dtos/create-map.dto';
import { MapItemForUserDto } from './dtos/map-item-for-user.dto';
import { MapResponseDto } from './dtos/map-response.dto';
import { UpdateMapDto } from './dtos/update-map.dto';
import { MapService } from './map.service';

@ApiTags('maps')
@ApiBearerAuth()
@Controller('maps')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  @UseAuthGuard([UserRole.USER])
  @ApiOperation({ summary: '사용자가 속해있는 지도 정보를 가져옵니다' })
  @ApiOkResponse({ type: [MapItemForUserDto] })
  findAll(@CurrentUser() user: User) {
    return this.mapService.findAll(user);
  }

  @Post()
  @UseAuthGuard([UserRole.USER])
  @ApiOkResponse({ type: MapItemForUserDto })
  @ApiOperation({ summary: '새 지도를 생성합니다' })
  create(@Body() createMapDto: CreateMapDto, @CurrentUser() user: User) {
    return this.mapService.create(createMapDto, user);
  }

  @Get(':id')
  @ApiOperation({ summary: '지도 정보 조회 (포함된 유저 정보, 맛집 개수...)' })
  @ApiOkResponse({ type: MapResponseDto })
  findOne(@Param('id') id: string) {
    // TODO: findOne For user로 만들어서 (ADMIN, READ, WRITE)권한없으면 403을 반환하는 라우트를 만들어야 합니다. -> 바다가 만든거로
    return this.mapService.findOne({ id });
  }

  @Patch(':id')
  @ApiOkResponse({ type: MapResponseDto })
  @ApiExcludeEndpoint()
  update(@Param('id') id: string, @Body() updateMapDto: UpdateMapDto) {
    return this.mapService.update(id, updateMapDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Number })
  @ApiBearerAuth()
  @ApiExcludeEndpoint()
  remove(@Param('id') id: string) {
    return this.mapService.remove(id);
  }
}
