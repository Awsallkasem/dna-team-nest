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
import { Leacture } from './leacture.model';
import { User } from './user.model';
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

@Table({ tableName: 'admin' })
export class Admin extends Model<Admin> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ type: DataType.ENUM(...Object.values(Year)), allowNull: false })
  @IsNotEmpty({ message: 'year is required' })
  year: Year;

  @Column({ type: DataType.ENUM(...Object.values(Spe)), allowNull: false })
  @IsNotEmpty({ message: 'year is required' })
  universityMajor: Spe;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  @IsNotEmpty({ message: 'User is required' })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
