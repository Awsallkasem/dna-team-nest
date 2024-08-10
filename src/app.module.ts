import { NotificationModule } from './app/notification/notification.module';
import { AdminModule } from './app/admin/admin.module';
import { AdminController } from './app/admin/admin.controller';
import { AdminService } from './app/admin/admin.service';
import { SuperAdminModule } from './app/superAdmin/superadmin.module';
import { SuperAdminController } from './app/superAdmin/superadmin.controller';
import { SuperAdminService } from './app/superAdmin/superadmin.service';
import { LibModule } from './app/lib/lib.module';
import { LibController } from './app/lib/lib.controller';
import { LibService } from './app/lib/lib.service';
import { UserModule } from './app/user/user.module';
import { UserController } from './app/user/user.controller';
import { UserService } from './app/user/user.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from './database/database.module';
import { sequelizeConfig } from './config/sequelize.config';
import { AuthModule } from './app/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
        NotificationModule, 
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AdminModule,
    SuperAdminModule,
    LibModule,
    UserModule,
    SequelizeModule.forRoot(sequelizeConfig),
    DatabaseModule,
    AuthModule,
    AdminModule,
    SuperAdminModule,
    LibModule,
    UserModule,
    NotificationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
