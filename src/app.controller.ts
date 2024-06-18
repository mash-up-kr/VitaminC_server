import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { USER } from './common/constant/role.constant';
import { UseAuthGuard } from './common/decorators/auth-guard.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/auth-test')
  @UseAuthGuard([USER])
  getHelloTest(): string {
    return this.appService.getHello();
  }
}
