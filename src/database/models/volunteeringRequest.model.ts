import {
  Model,
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';
import { IsNotEmpty } from 'class-validator';
import { User } from './user.model';
import { Massion } from './teamMember.model';
export enum Year {
  first = 'first',
  second = 'second',
  third = 'third',
  fourth = 'fourth',
  fifth = 'fifth',
  sixth = 'sixth',
}
export enum Spe {
  DOC = 'doc',
  DEN = 'den',
  PHA = 'pha',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export interface VRolunteeringRequestAttributes {
  id: number;
  FullName: string;
  gender: Gender;
  phoneNumber: string;
  facebookLink: string;
  teleId: string;
  governorate: string;
  year: Year;
  universityMajor: Spe;
  massion: string;
}

@Table({ tableName: 'volunteeringRequest' })
export class VRolunteeringRequest
  extends Model<VRolunteeringRequest>
  implements VRolunteeringRequestAttributes
{
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  @IsNotEmpty({ message: ' FullName is required' })
  FullName: string;

  @Column({ type: DataType.ENUM(...Object.values(Gender)), allowNull: false })
  @IsNotEmpty({ message: 'gender is required' })
  gender: Gender;

  @Column({ type: DataType.STRING, allowNull: false })
  @IsNotEmpty({ message: 'phoneNumber is required' })
  phoneNumber: string;

  @Column({ type: DataType.STRING, allowNull: false })
  @IsNotEmpty({ message: 'facebookLink is required' })
  facebookLink: string;

  @Column({ type: DataType.STRING, allowNull: false })
  @IsNotEmpty({ message: 'teleId is required' })
  teleId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  @IsNotEmpty({ message: 'governorate is required' })
  governorate: string;

  @Column({ type: DataType.ENUM(...Object.values(Year)), allowNull: false })
  @IsNotEmpty({ message: 'year is required' })
  year: Year;

  @Column({ type: DataType.ENUM(...Object.values(Spe)), allowNull: false })
  @IsNotEmpty({ message: 'universityMajor is required' })
  universityMajor: Spe;

  @Column({ type: DataType.ENUM(...Object.values(Massion)), allowNull: false })
  @IsNotEmpty({ message: 'massion is required' })
  massion: Massion;
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
