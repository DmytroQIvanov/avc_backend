import { UserEntity } from 'src/model/user.entity';
import { OrderEntity } from './order.entity';
import { ProductEntity } from './product.entity';

import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  Unique,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';

import { Min, Max } from 'class-validator';

@Entity({ name: 'basket' })
export class OrderProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => ProductEntity, (product) => product.user)
  @JoinColumn()
  product: ProductEntity;

  @Min(0)
  @Column()
  quantity: number;

  @ManyToOne((type) => UserEntity)
  user: UserEntity;
}
