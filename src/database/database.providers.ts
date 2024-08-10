import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/database/models/user.model';
import { Leacture } from './models/leacture.model';
import { Complaints } from './models/complaints.model';
import { Comments } from './models/comments.model';
import { NumberOfDownloads } from './models/numberOfDownloads.model';
import { Notifications } from './models/notification.model';
import { Admin } from './models/admin.model';
import { TeamMember } from './models/teamMember.model';
import { VRolunteeringRequest } from './models/volunteeringRequest.model';
import { Subject } from './models/subject.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'dnaTeam',
        password: 'dnaTeam',
        database: 'dnaTeam',
        logging: false,
      });

      sequelize.addModels([
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
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
