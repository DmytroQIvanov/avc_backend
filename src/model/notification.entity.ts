import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  Unique,
  ManyToOne,
} from 'typeorm';

import { Min, Max } from 'class-validator';
import { UserEntity } from './user.entity';

@Entity({ name: 'notification' })
// @Unique(['login'])
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  notificationNameUA: string;

  @Column({ type: 'varchar', length: 300 })
  contentUA: string;
  //
  // @Column()
  // notificationNameEN: string;
  //
  // @Column({ type: 'varchar', length: 300 })
  // contentEN: string;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;
}
