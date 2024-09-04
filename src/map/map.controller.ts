import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CheckInviteLinkResponseDto } from 'src/map/dtos/check-invite-link-response.dto';
import { CreateTagDto } from 'src/map/dtos/create-tag.dto';
import { TagResponseDto } from 'src/map/dtos/tag-response.dto';

import { UseAuthGuard } from '../common/decorators/auth-guard.decorator';
import { UseMapRoleGuard } from '../common/decorators/map-role-guard.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import { GroupMap, InviteLink, User, UserMapRole, UserRole } from '../entities';
import { InviteLinkService } from '../invite-link/invite-link.service';
import { CreateMapDto } from './dtos/create-map.dto';
import { InviteLinkResponseDto } from './dtos/invite-link-response.dto';
import { MapItemForUserDto } from './dtos/map-item-for-user.dto';
import { MapResponseDto, PublicMapResponseDto } from './dtos/map-response.dto';
import { UpdateMapDto } from './dtos/update-map.dto';
import { ArrayElement, MapService, publicMapOrder } from './map.service';

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
    return this.mapService.create(createMapDto, user);
  }

  @Get()
  @ApiOperation({ summary: '사용자가 속해있는 지도를 가져옵니다.' })
  @ApiOkResponse({ type: [MapItemForUserDto] })
  @ApiBearerAuth()
  @UseAuthGuard([UserRole.USER])
  findAll(@CurrentUser() user: User): Promise<MapItemForUserDto[]> {
    return this.mapService.findAll(user);
  }

  @Get('public')
  @ApiOperation({ summary: '공개된 지도를 가져옵니다.' })
  @ApiBearerAuth()
  @UseAuthGuard([UserRole.USER])
  @ApiOkResponse({ type: [PublicMapResponseDto] })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: publicMapOrder,
  })
  @ApiQuery({ name: 'name', required: false })
  async findAllPublic(
    @Query('order')
    order: ArrayElement<typeof publicMapOrder>,
    @Query('name') name: string,
  ): Promise<PublicMapResponseDto[]> {
    const map = await this.mapService.findPublic({ order, name });
    return map.map((m) => new PublicMapResponseDto(m));
  }

  @Get(':id')
  @ApiOperation({ summary: '지도 정보 조회 (포함된 유저 정보, 맛집 개수...)' })
  @ApiOkResponse({ type: MapResponseDto })
  @UseMapRoleGuard()
  @ApiBearerAuth()
  @UseAuthGuard([UserRole.USER])
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<MapResponseDto> {
    const dto = await this.mapService.findOne({ id });
    dto.sortMembers(user);
    return dto;
  }

  @Patch(':id')
  @ApiOperation({ summary: '지도 정보 업데이트 (이름, 공개방, 설명 등)' })
  @ApiOkResponse({ type: MapResponseDto })
  @UseMapRoleGuard([UserMapRole.ADMIN])
  @ApiBearerAuth()
  @UseAuthGuard([UserRole.USER])
  async update(
    @Param('id') id: string,
    @Body() updateMapDto: UpdateMapDto,
  ): Promise<MapResponseDto> {
    const map: GroupMap = await this.mapService.update(id, updateMapDto);
    const dto = new MapResponseDto(map);
    return dto;
  }

  @Delete(':id')
  @ApiOkResponse({ type: Number })
  @ApiExcludeEndpoint()
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.mapService.remove(id);
  }

  @Post(':id/invite-links')
  @ApiOperation({
    summary: '지도의 초대링크 생성',
    description: '유효기간은 7일로 설정되어 있습니다.',
  })
  @ApiBearerAuth()
  @ApiResponse({ type: InviteLinkResponseDto })
  @UseMapRoleGuard([UserMapRole.ADMIN])
  @UseAuthGuard([UserRole.USER])
  async createInviteLink(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<InviteLinkResponseDto> {
    const entity: InviteLink = await this.inviteLinkService.create(id, user);
    return new InviteLinkResponseDto(entity);
  }

  @Get(':id/tag')
  @ApiOperation({
    summary: '기본 태그와 지도에 저장된 태그를 조회합니다.',
  })
  @ApiBearerAuth()
  @ApiResponse({ type: TagResponseDto, isArray: true })
  @ApiBearerAuth()
  @UseAuthGuard([UserRole.USER])
  findTagByMapId(@Param('id') id: string) {
    return this.mapService.findTagByMapId(id);
  }

  @Post(':id/tag')
  @ApiOperation({
    summary: '맛집 저장시 사용할 태그를 생성합니다.',
  })
  @ApiBearerAuth()
  @ApiResponse({ type: TagResponseDto })
  @ApiBearerAuth()
  @UseAuthGuard([UserRole.USER])
  createTag(@Param('id') id: string, @Body() createTagDto: CreateTagDto) {
    return this.mapService.createTag(id, createTagDto);
  }

  @Delete(':id/tag/:name')
  @ApiOperation({
    summary: '맛집 저장시 사용할 태그를 삭제합니다.',
  })
  @ApiBearerAuth()
  @UseAuthGuard([UserRole.USER])
  removeTag(@Param('id') id: string, @Param('name') name: string) {
    return this.mapService.removeTag(id, name);
  }

  @Get('invite-links/:token')
  @ApiResponse({ type: CheckInviteLinkResponseDto })
  @ApiOperation({
    summary: '초대링크 만료 검사 + 지도정보 response',
  })
  async checkInviteLink(
    @Param('token') inviteLinkToken: string,
  ): Promise<CheckInviteLinkResponseDto> {
    const inviteLink: InviteLink =
      await this.inviteLinkService.validate(inviteLinkToken);

    const map: MapResponseDto = await this.mapService.findOne(inviteLink.map);
    map.sortMembers();
    const previewList: string[] = await this.mapService.getPlacesPreview(
      inviteLink.map,
    );

    const inviteLinkResponseDto = new InviteLinkResponseDto(inviteLink);
    return new CheckInviteLinkResponseDto(
      map,
      inviteLinkResponseDto,
      previewList,
    );
  }

  @Post('invite-links/:token')
  @ApiOperation({
    summary: '초대링크로 지도에 승선',
    description: '초대장 화면에서 "승선하기" 버튼 클릭 시 호출',
  })
  @ApiBearerAuth()
  @UseAuthGuard([UserRole.USER])
  async joinInviteLink(
    @Param('token') inviteLinkToken: string,
    @CurrentUser() user: User,
  ) {
    const inviteLink: InviteLink =
      await this.inviteLinkService.validate(inviteLinkToken);
    await this.mapService.createUserMap(
      user,
      inviteLink.map,
      inviteLink.mapRole,
    );
  }
}
