import { Global, Module } from '@nestjs/common';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { AuthClient } from '../client/AuthClient';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [
    CacheModule.register({
      ttl: 60000,
      max: 1000,
    })
  ],
  controllers: [AuthController],
  providers: [{
    provide: 'IAuthService',
    useClass: AuthService,
  }, {
    provide: 'IAuthClient',
    useClass: AuthClient,
  }],
  exports: ['IAuthService', CacheModule]
})
export class AuthModule { }