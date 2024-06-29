import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UseAuthGuard } from '../common/decorators/auth-guard.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User, UserRole } from '../entities';
import { CreateMapDto } from './dtos/create-map.dto';
import { MapItemForUserDto } from './dtos/map-item-for-user.dto';
import { MapResponseDto } from './dtos/map-response.dto';
import { UpdateMapDto } from './dtos/update-map.dto';
import { MapService } from './map.service';

@ApiTags('maps')
@Controller('maps')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Post()
  @UseAuthGuard([UserRole.USER])
  @ApiOkResponse({ type: MapItemForUserDto })
  @ApiOperation({ summary: '새 지도를 생성합니다' })
  create(@Body() createMapDto: CreateMapDto, @CurrentUser() user: User) {
    // ensure alpha numeric
    if (!/[A-Za-z0-9-_]/.test(createMapDto.id)) {
      throw new BadRequestException(
        '지도 아이디는 영문, 숫자, 하이픈만 가능합니다',
      );
    }

    return this.mapService.create(createMapDto, user);
  }

  @Get()
  @UseAuthGuard([UserRole.USER])
  @ApiOperation({ summary: '사용자가 속해있는 지도를 가져옵니다' })
  @ApiOkResponse({ type: [MapItemForUserDto] })
  findAll(@CurrentUser() user: User) {
    return this.mapService.findAll(user);
  }

  @Get(':id')
  @ApiOkResponse({ type: MapResponseDto })
  findOne(@Param('id') id: string) {
    // TODO: findOne For user로 만들어서 (ADMIN, READ, WRITE)권한없으면 403을 반환하는 라우트를 만들어야 합니다.
    return this.mapService.findOne({ id });
  }

  @Patch(':id')
  @ApiOkResponse({ type: MapResponseDto })
  update(@Param('id') id: string, @Body() updateMapDto: UpdateMapDto) {
    return this.mapService.update(id, updateMapDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Number })
  remove(@Param('id') id: string) {
    return this.mapService.remove(id);
  }
}
