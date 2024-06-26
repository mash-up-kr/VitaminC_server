import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOkResponse({ type: UserResponseDto })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return UserResponseDto.fromEntity(user);
  }

  @Get()
  @ApiOkResponse({ type: [UserResponseDto] })
  async findAll() {
    const users = await this.userService.findAll();
    return users.map((user) => UserResponseDto.fromEntity(user));
  }

  @Get(':id')
  @ApiOkResponse({ type: UserResponseDto })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne({ id: +id });
    return UserResponseDto.fromEntity(user);
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserResponseDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(+id, updateUserDto);
    return UserResponseDto.fromEntity(user);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Number })
  async remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
