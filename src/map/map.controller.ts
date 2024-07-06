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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UseAuthGuard } from '../common/decorators/auth-guard.decorator';
import { UseMapRoleGuard } from '../common/decorators/map-role-guard.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User, UserMapRole, UserRole } from '../entities';
import { InviteLinkService } from '../invite-link/invite-link.service';
import { CreateMapDto } from './dtos/create-map.dto';
import { InviteLinkResponseDto } from './dtos/invite-link-response.dto';
import { MapItemForUserDto } from './dtos/map-item-for-user.dto';
import { MapResponseDto } from './dtos/map-response.dto';
import { UpdateMapDto } from './dtos/update-map.dto';
import { MapService } from './map.service';

@ApiTags('maps')
@Controller('maps')
export class MapController {
  constructor(
    private readonly mapService: MapService,
    private readonly inviteLinkService: InviteLinkService,
  ) {}

  @Post()
  @ApiOkResponse({ type: MapItemForUserDto })
  @ApiOperation({ summary: '새 지도를 생성합니다' })
  @ApiBearerAuth()
  @UseAuthGuard([UserRole.USER])
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
  @ApiOperation({ summary: '사용자가 속해있는 지도를 가져옵니다' })
  @ApiOkResponse({ type: [MapItemForUserDto] })
  @ApiBearerAuth()
  @UseAuthGuard([UserRole.USER])
  findAll(@CurrentUser() user: User) {
    return this.mapService.findAll(user);
  }

  @Get(':id')
  @ApiOkResponse({ type: MapResponseDto })
  @ApiBearerAuth()
  @UseMapRoleGuard()
  @UseAuthGuard([UserRole.USER])
  findOne(@Param('id') id: string) {
    return this.mapService.findOne({ id });
  }

  @Patch(':id')
  @ApiOkResponse({ type: MapResponseDto })
  @ApiBearerAuth()
  @UseMapRoleGuard([UserMapRole.ADMIN])
  @UseAuthGuard([UserRole.USER])
  update(@Param('id') id: string, @Body() updateMapDto: UpdateMapDto) {
    return this.mapService.update(id, updateMapDto);
  }

  // TODO
  // @Delete(':id')
  // @ApiOkResponse({ type: Number })
  // @ApiBearerAuth()
  // @UseMapRoleGuard([UserMapRole.ADMIN])
  // @UseAuthGuard([UserRole.USER])
  // remove(@Param('id') id: string) {
  //   return this.mapService.remove(id);
  // }

  @Post(':id/invite-link')
  @ApiResponse({ type: InviteLinkResponseDto })
  @ApiBearerAuth()
  @UseMapRoleGuard([UserMapRole.ADMIN])
  @UseAuthGuard([UserRole.USER])
  async createInviteLink(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<InviteLinkResponseDto> {
    return this.inviteLinkService.create(id, user);
  }
}
