import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
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

  @Get('me')
  @ApiOperation({ summary: '내 정보를 조회합니다.' })
  @UseAuthGuard([UserRole.USER])
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBearerAuth()
  getMe(@CurrentUser() user: User): UserResponseDto {
    return new UserResponseDto(user);
  }

  @Patch('me')
  @ApiOperation({ summary: '내 정보를 수정합니다.' })
  @ApiConsumes('multipart/form-data')
  @UseAuthGuard([UserRole.USER])
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBearerAuth()
  @ApiBody({
    required: false,
    schema: {
      type: 'object',
      properties: {
        nickname: {
          type: 'string',
          description: '사용자 닉네임',
        },
        profileImage: {
          type: 'File',
          format: 'binary',
          description: '프로필 이미지',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateMe(
    @Body() updateUserDto: UpdateUserRequestDto,
    @CurrentUser() user: User,
    @UploadedFile() profileImage?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.userService.update(
      user.id,
      updateUserDto,
      profileImage,
    );

    return new UserResponseDto(updatedUser);
  }

  @Get(':id')
  @UseAuthGuard([UserRole.USER])
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.findOne({ id: +id });
    return new UserResponseDto(user);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Number })
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('check/nickname')
  @ApiOperation({ summary: '닉네임 중복체크합니다.' })
  @ApiQuery({ type: String, name: 'nickname', description: '사용자 닉네임' })
  @ApiOkResponse({})
  async checkDuplicateNickname(@Query('nickname') nickname: string) {
    return this.userService.checkDuplicateNickname(nickname);
  }

  @Delete('maps/:mapId')
  @ApiOperation({ summary: '지도(그룹) 나가기' })
  @ApiOkResponse({})
  @UseAuthGuard([UserRole.USER])
  @ApiBearerAuth()
  async leaveMap(@CurrentUser() user: User, @Param('mapId') mapId: string) {
    return await this.userService.leaveMap(user.id, mapId);
  }
}
