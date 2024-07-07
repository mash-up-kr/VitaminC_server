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
@ApiBearerAuth()
@Controller('maps')
export class MapController {
  constructor(
    private readonly mapService: MapService,
    private readonly inviteLinkService: InviteLinkService,
  ) {}

  @Post()
  @ApiOkResponse({ type: MapItemForUserDto })
  @ApiOperation({ summary: '새 지도를 생성합니다' })
  @UseAuthGuard([UserRole.USER])
  create(@Body() createMapDto: CreateMapDto, @CurrentUser() user: User) {
    return this.mapService.create(createMapDto, user);
  }

  @Get()
  @ApiOperation({ summary: '사용자가 속해있는 지도를 가져옵니다.' })
  @ApiOkResponse({ type: [MapItemForUserDto] })
  @UseAuthGuard([UserRole.USER])
  findAll(@CurrentUser() user: User) {
    return this.mapService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: '지도 정보 조회 (포함된 유저 정보, 맛집 개수...)' })
  @ApiOkResponse({ type: MapResponseDto })
  @UseMapRoleGuard()
  @UseAuthGuard([UserRole.USER])
  findOne(@Param('id') id: string) {
    return this.mapService.findOne({ id });
  }

  @Patch(':id')
  @ApiOkResponse({ type: MapResponseDto })
  @UseMapRoleGuard([UserMapRole.ADMIN])
  @UseAuthGuard([UserRole.USER])
  update(@Param('id') id: string, @Body() updateMapDto: UpdateMapDto) {
    return this.mapService.update(id, updateMapDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Number })
  @ApiExcludeEndpoint()
  remove(@Param('id') id: string) {
    return this.mapService.remove(id);
  }

  @Post(':id/invite-links')
  @ApiOperation({
    summary: '지도의 초대링크를 생성합니다.',
    description: '유효기간은 7일로 설정되어 있습니다.',
  })
  @ApiResponse({ type: InviteLinkResponseDto })
  @UseMapRoleGuard([UserMapRole.ADMIN])
  @UseAuthGuard([UserRole.USER])
  async createInviteLink(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<InviteLinkResponseDto> {
    return this.inviteLinkService.create(id, user);
  }
}
