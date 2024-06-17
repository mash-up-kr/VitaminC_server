import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [HttpModule.register({}), UsersModule],
  providers: [
    KakaoStrategy,
    { provide: 'AUTH_SERVICE', useClass: AuthService },
    AuthService,
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
