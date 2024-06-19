import { Controller, Get } from '@nestjs/common';

import { User } from '@prisma/client';

import { AppService } from './app.service';
import { USER } from './common/constant/role.constant';
import { UseAuthGuard } from './common/decorators/auth-guard.decorator';
import { CurrentUser } from './common/decorators/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/me')
  @UseAuthGuard([USER])
  getMe(@CurrentUser() user: User): User {
    return user;
  }
}
