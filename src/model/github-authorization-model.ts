import { Model, Table, Column, DataType, HasOne, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table({
  tableName: 'github-authorization',
  schema: 'public'
})
export class GithubAuthorizationModel extends Model<GithubAuthorizationModel> {

  @Column({ primaryKey: true, type: DataType.STRING })
  userName: string;

  @Column({ primaryKey: true, type: DataType.INTEGER })
  installation_id: number;

}
