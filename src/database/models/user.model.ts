import {
  Model,
  Table,
  Column,
  DataType,
  HasMany,
  PrimaryKey,
  AutoIncrement,
  HasOne,
} from 'sequelize-typescript';
import { IsEmail, Length, IsNotEmpty } from 'class-validator';
import { Leacture } from './leacture.model';
import { Complaints } from './complaints.model';
import { Comments } from './comments.model';
import { Notifications } from './notification.model';
import { Admin, Year } from './admin.model';
import { TeamMember } from './teamMember.model';
import { VRolunteeringRequest } from './volunteeringRequest.model';

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  TEAMMEMBAR = 'teamMember',
  SUPERADMIN = 'superAdmin',
  LIB = 'lib',
}

export interface UserAttributes {
  id: number;
  email: string;
  Fname: string;
  Lname: string;
  password: string;
  year: Year;
}

@Table({ tableName: 'users' })
export class User extends Model<User> implements UserAttributes {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.ENUM(...Object.values(UserRole)), allowNull: false })
  @IsNotEmpty({ message: 'Role is required' })
  role: UserRole;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Column({ type: DataType.ENUM(...Object.values(Year)), allowNull: false })
  @IsNotEmpty({ message: 'year is required' })
  year: Year;

  @Column(DataType.INTEGER)
  playerIds: number;

  @Column({ type: DataType.STRING, allowNull: false })
  @IsNotEmpty({ message: ' name is required' })
  Fname: string;

  @Column({ type: DataType.STRING, allowNull: false })
  @IsNotEmpty({ message: ' name is required' })
  Lname: string;

  @Column({ type: DataType.STRING, validate: { len: [8, 255] } })
  @Length(8, 255, { message: 'pasword must be 8 characters long' })
  password: string;

  @HasMany(() => Leacture)
  leactures: Leacture[];

  @HasMany(() => Complaints)
  compalaints: Complaints[];

  @HasMany(() => Comments)
  comments: Comments[];

  @HasMany(() => Notifications)
  notifications: Notifications[];

  @HasOne(() => Admin)
  admin: Admin;

  @HasOne(() => TeamMember)
  teamMember: TeamMember;

  @HasOne(() => VRolunteeringRequest)
  vRolunteeringRequest: VRolunteeringRequest;
}
