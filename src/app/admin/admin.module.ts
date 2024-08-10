/*
https://docs.nestjs.com/modules
*/

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { decodeTokenMiddleware } from 'src/middlewares/authrization/decodeToken.middleware';
import { AdminMiddleware } from 'src/middlewares/authrization/admin.middleware';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, AuthService],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(decodeTokenMiddleware)
      .forRoutes('api/admin/*')
      .apply(AdminMiddleware)
      .forRoutes('api/admin/*');
  }
}
