import { OrderProductEntity } from './orderProduct';

import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
} from 'typeorm';

import { Min, Max } from 'class-validator';
import { OrderEntity } from './order.entity';
import { NotificationEntity } from './notification.entity';

@Entity({ name: 'guest' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => OrderProductEntity, (product) => product.user, {
    cascade: true,
  })
  basket: OrderProductEntity[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;

  @OneToMany((type) => OrderEntity, (order) => order.user, {
    cascade: true,
  })
  orders: OrderEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user, {
    cascade: true,
  })
  notifications: NotificationEntity[];
}
