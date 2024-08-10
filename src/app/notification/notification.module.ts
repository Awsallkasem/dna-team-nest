import { NotificationController } from './notification.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { NotificationsService } from './notification.service';

@Module({
  imports: [],
  controllers: [
        NotificationController, ],
  providers: [NotificationsService],
  exports:[NotificationsService]
})
export class NotificationModule {}
