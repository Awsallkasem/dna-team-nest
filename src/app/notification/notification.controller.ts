/*
https://docs.nestjs.com/controllers#controllers
*/
import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { Get } from '@nestjs/common';

@Controller()
export class NotificationController {
  constructor(private readonly oneSignalService: NotificationsService) {}

  @Post('send')
  async sendNotification(
    @Body() body: { contents: { [key: string]: string }; playerIds: string[] },
  ) {
    return this.oneSignalService.sendNotification(
      body.contents,
      body.playerIds,
    );
  }
}
