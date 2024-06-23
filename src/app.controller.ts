import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { UseAuthGuard } from './common/decorators/auth-guard.decorator';
import { CurrentUser } from './common/decorators/user.decorator';
import { User } from './user/entities/user.entity';
import { UserRole } from './user/entities/user.type';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/me')
  @UseAuthGuard([UserRole.USER])
  getMe(@CurrentUser() user: User): User {
    return user;
  }
}
