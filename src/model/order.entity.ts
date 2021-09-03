import { ProductEntity } from './product.entity';

import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Unique,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { OrderProductEntity } from './orderProduct';
import { UserEntity } from './user.entity';

@Entity({ name: 'busket' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => OrderProductEntity, (product) => product.order, {
    cascade: true,
  })
  @JoinTable()
  orderProducts: OrderProductEntity[];

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  @Column({ default: 'Accepted' })
  status: string;
}
