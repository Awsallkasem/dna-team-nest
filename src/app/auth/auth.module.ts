import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { NotificationsService } from '../notification/notification.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),

  ],
  controllers: [AuthController],
  providers: [AuthService,NotificationsService],
})
export class AuthModule { }
