import { Model, Table, Column, DataType, BelongsTo, ForeignKey, AutoIncrement, PrimaryKey } from 'sequelize-typescript';
import { IsNotEmpty } from 'class-validator';
import { Leacture } from './leacture.model';



@Table({ tableName: 'numberOfDownloads' })
export class NumberOfDownloads extends Model<NumberOfDownloads>{
@PrimaryKey
@AutoIncrement
@Column({type:DataType.INTEGER})
id: number;

@Column({type:DataType.INTEGER,allowNull:false})
@IsNotEmpty({ message: 'number is required' })
amount:number;


@Column({ type: DataType.DATEONLY })
date: Date;


@ForeignKey(() => Leacture)
@Column({ type: DataType.INTEGER, allowNull: false })
@IsNotEmpty({ message: 'leacture is required' })
leactureId: number;

@BelongsTo(() => Leacture)
leacture: Leacture;

}
