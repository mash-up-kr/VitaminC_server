import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UseAuthGuard } from './common/decorators/auth-guard.decorator';
import { USER } from './common/constant/role.constant';

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
