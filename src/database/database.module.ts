import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Leacture } from './models/leacture.model';
import { Complaints } from './models/complaints.model';
import { Comments } from './models/comments.model';
import { NumberOfDownloads } from './models/numberOfDownloads.model';
import { Notifications } from './models/notification.model';
import { Admin } from './models/admin.model';
import { TeamMember } from './models/teamMember.model';
import { VRolunteeringRequest } from './models/volunteeringRequest.model';
import { Subject } from './models/subject.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Leacture,
      Complaints,
      Comments,
      NumberOfDownloads,
      Notifications,
      Admin,
      TeamMember,
      VRolunteeringRequest,
      Subject,
    ]),
  ],
  providers: [...databaseProviders],
  exports: [...databaseProviders, SequelizeModule],
})
export class DatabaseModule {}
