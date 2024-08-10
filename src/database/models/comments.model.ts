import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  ForeignKey,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { IsNotEmpty } from 'class-validator';
import { User } from './user.model';
import { Leacture } from './leacture.model';

@Table({ tableName: 'Comments' })
export class Comments extends Model<Comments> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  content: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  @IsNotEmpty({ message: 'UserId is required' })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Leacture)
  @Column({ type: DataType.INTEGER, allowNull: true })
  leactureId: number;

  @BelongsTo(() => Leacture)
  leacture: Leacture;
  @ForeignKey(() => Comments)
  @Column({ type: DataType.INTEGER, allowNull: true })
  parentId: number;

  @BelongsTo(() => Comments, { foreignKey: 'parentId', as: 'parent' })
  parent: Comments;

  @HasMany(() => Comments, { foreignKey: 'parentId', as: 'replies' })
  replies: Comments[];
}
