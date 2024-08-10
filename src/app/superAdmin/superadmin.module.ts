/*
https://docs.nestjs.com/modules
*/

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SuperAdminController } from './superadmin.controller';
import { SuperAdminService } from './superadmin.service';
import { decodeTokenMiddleware } from 'src/middlewares/authrization/decodeToken.middleware';
import { SuperAdminMiddleware } from 'src/middlewares/authrization/superAdmin.middleware';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { AuthService } from '../auth/auth.service';
import { EmailService } from '../email/email.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [SuperAdminController],
  providers: [SuperAdminService, AuthService,EmailService],
})
export class SuperAdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(decodeTokenMiddleware)
      .forRoutes('api/superAdmin/*')
      .apply(SuperAdminMiddleware)
      .forRoutes('api/superAdmin/*');
  }
}
