/*
https://docs.nestjs.com/modules
*/

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { decodeTokenMiddleware } from 'src/middlewares/authrization/decodeToken.middleware';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(decodeTokenMiddleware).forRoutes('api/user/*');
  }
}
