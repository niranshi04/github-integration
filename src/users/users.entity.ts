import { Entity, Column, PrimaryColumn } from 'typeorm';
@Entity()
export class Users {
  @PrimaryColumn()
  username: string;

  @Column()
  profileUrl: string;

  @Column()
  accessToken: string;
}
