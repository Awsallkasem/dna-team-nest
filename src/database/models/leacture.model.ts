import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { IsNotEmpty } from 'class-validator';
import { User } from './user.model';
import { Comments } from './comments.model';
import { NumberOfDownloads } from './numberOfDownloads.model';
import { Subject } from './subject.model';

export enum Year {
  first = 'first',
  second = 'second',
  third = 'third',
  fourth = 'fourth',
  fifth = 'fifth',
  sixth = 'sixth',
}

export interface LeactureAttributes {
  id: number;
  year: Year;
  leactureName: string;
  subject: string;
  path: string;
}

@Table({ tableName: 'leacture' })
export class Leacture extends Model<Leacture> implements LeactureAttributes {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  @IsNotEmpty({ message: 'leacture name  is required' })
  leactureName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  subject: string;

  @Column({ type: DataType.STRING, allowNull: false })
  path: string;

  @Column({ type: DataType.ENUM(...Object.values(Year)), allowNull: false })
  @IsNotEmpty({ message: 'year is required' })
  year: Year;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isArchived: boolean;

  @Column({
    type: DataType.DATEONLY,
  })
  date: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  publishedId: number;

  @BelongsTo(() => User)
  publisher: User;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.INTEGER, allowNull: false })
  @IsNotEmpty({ message: 'subId is required' })
  subId: number;

  @BelongsTo(() => Subject)
  subjectR: Subject;

  @HasMany(() => Comments)
  comments: Comments[];

  @HasMany(() => NumberOfDownloads)
  downloads: NumberOfDownloads[];
  static async statisticalsnumberOfDownloads(year: number): Promise<any[]> {
    return await this.findAll({
      include: [
        {
          model: NumberOfDownloads,
          as: 'downloads',
          where: this.sequelize.where(
            this.sequelize.fn('YEAR', this.sequelize.col('downloads.date')),
            year,
          ),
          attributes: {
            exclude: [
              'amount',
              'id',
              'date',
              'leactureId',
              'leacture',
              'createdAt',
              'updatedAt',
            ],
          },
        },
      ],
      attributes: [
        [
          this.sequelize.fn(
            'YEARWEEK',
            this.sequelize.col('downloads.date'),
            0,
          ),
          'week',
        ],
        [this.sequelize.col('Leacture.subject'), 'subject'],
        [
          this.sequelize.fn('SUM', this.sequelize.col('downloads.amount')),
          'totalDownloads',
        ],
      ],
      group: [
        this.sequelize.fn('YEARWEEK', this.sequelize.col('downloads.date'), 0),
        'Leacture.subject',
        'Leacture.year',
      ],
      raw: true,
    });
  }
}
