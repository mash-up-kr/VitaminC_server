import { Controller, Get } from '@nestjs/common';

import { UseAuthGuard } from './common/decorators/auth-guard.decorator';
import { CurrentUser } from './common/decorators/user.decorator';
import { User } from './user/entities/user.entity';
import { UserRole } from './user/entities/user.type';

@Controller('api/v1')
export class AppController {
  constructor() {}

  @Get('health')
  health(): string {
    return 'ok';
  }

  @Get('me')
  @UseAuthGuard([UserRole.USER])
  getMe(@CurrentUser() user: User): User {
    return user;
  }
}
