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

@Table({ tableName: 'notifications' })
export class Notifications extends Model<Notifications> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  @IsNotEmpty({ message: 'content is required' })
  content: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  @IsNotEmpty({ message: 'UserId is required' })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
