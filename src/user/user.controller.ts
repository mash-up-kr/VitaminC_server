import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

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
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne({ id: +id });
    return user;
  }

  @Patch()
  @UseAuthGuard([UserRole.USER])
  @ApiOkResponse({ type: UserResponseDto })
  async update(
    @Body() updateUserDto: UpdateUserRequestDto,
    @CurrentUser() user: User,
  ) {
    return await this.userService.update(+user.id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Number })
  async remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('check/nickname')
  @ApiOkResponse({})
  async checkDuplicateNickname(@Query('nickname') nickname: string) {
    return this.userService.checkDuplicateNickname(nickname);
  }
}
