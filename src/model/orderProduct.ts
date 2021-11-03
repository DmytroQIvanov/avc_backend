import { UserEntity } from 'src/model/user.entity';
import { ProductEntity } from './product.entity';

import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';

import { Min, Max } from 'class-validator';
import { OrderEntity } from './order.entity';

@Entity()
export class OrderProductEntity {
  @PrimaryGeneratedColumn('uuid')
  ID: string;

  @ManyToOne(() => ProductEntity, (product) => product)
  @JoinTable()
  product: ProductEntity;

  @Min(0)
  @Column()
  quantity: number;

  @ManyToOne((type) => UserEntity, (user) => user.basket, {
    // cascade: true,
  })
  user: UserEntity;

  @Column()
  taste: number;

  @Column()
  weight: number;

  @ManyToOne((type) => OrderEntity, (order) => order.orderProducts)
  order: OrderEntity;
}
