import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const sequelizeConfig: SequelizeModuleOptions = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'dnaTeam',
  password: 'dnaTeam',
  database: 'dnaTeam',
  autoLoadModels: true,
  synchronize: true,
};
