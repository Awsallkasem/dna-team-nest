import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { IsNotEmpty } from 'class-validator';
import { Leacture } from './leacture.model';

export enum Year {
  first = 'first',
  second = 'second',
  third = 'third',
  fourth = 'fourth',
  fifth = 'fifth',
  sixth = 'sixth',
}
@Table({ tableName: 'subject' })
export class Subject extends Model<Subject> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  @IsNotEmpty({ message: 'subject is required' })
  subject: string;

  @Column({ type: DataType.ENUM(...Object.values(Year)), allowNull: false })
  @IsNotEmpty({ message: 'year is required' })
  year: Year;

  @HasMany(() => Leacture)
  leactures: Leacture[];
}
