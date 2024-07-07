import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { UseAuthGuard } from 'src/common/decorators/auth-guard.decorator';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User, UserRole } from 'src/entities';

import { UpdateUserRequestDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseAuthGuard([UserRole.USER])
  @ApiOkResponse({ type: UserResponseDto })
  @ApiOperation({ summary: '맛집지도 (GroupMap)에 등록된 장소 전부 가져오기' })
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne({ id: +id });
    return user;
  }

  @Patch()
  @UseAuthGuard([UserRole.USER])
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBearerAuth()
  async update(
    @Body() updateUserDto: UpdateUserRequestDto,
    @CurrentUser() user: User,
  ) {
    return await this.userService.update(+user.id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Number })
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('check/nickname')
  @ApiOperation({ summary: '닉네임이 중복되는지 확인' })
  @ApiQuery({ type: String, name: 'nickname', description: '사용자 닉네임' })
  @ApiOkResponse({})
  async checkDuplicateNickname(@Query('nickname') nickname: string) {
    return this.userService.checkDuplicateNickname(nickname);
  }

  @Get(':id/maps/:mapId')
  @ApiOperation({ summary: '지도(그룹) 나가기' })
  @ApiOkResponse({})
  async leaveMap(@Param('id') id: string, @Param('mapId') mapId: string) {
    return this.userService.leaveMap(+id, mapId);
  }
}
