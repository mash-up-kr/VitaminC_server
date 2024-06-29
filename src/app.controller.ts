import { Controller, Get, InternalServerErrorException } from '@nestjs/common';

import { AppService } from './app.service';
import { UseAuthGuard } from './common/decorators/auth-guard.decorator';
import { CurrentUser } from './common/decorators/user.decorator';
import { User, UserRole } from './entities';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    throw new InternalServerErrorException('First issue');

    return this.appService.getHello();
  }

  @Get('/me')
  @UseAuthGuard([UserRole.USER])
  getMe(@CurrentUser() user: User): User {
    return user;
  }
}
