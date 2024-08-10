/*
https://docs.nestjs.com/modules
*/

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LibController } from './lib.controller';
import { LibService } from './lib.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { decodeTokenMiddleware } from 'src/middlewares/authrization/decodeToken.middleware';
import { LibMiddleware } from 'src/middlewares/authrization/lib.middleware';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [LibController],
  providers: [LibService, AuthService],
})
export class LibModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(decodeTokenMiddleware)
      .forRoutes('api/lib/*')
      .apply(LibMiddleware)
      .forRoutes('api/lib/*');
  }
}
