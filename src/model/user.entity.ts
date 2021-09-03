import { OrderProductEntity } from './orderProduct';

import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  Unique,
  OneToMany,
} from 'typeorm';

import { Min, Max } from 'class-validator';
import { OrderEntity } from './order.entity';

@Entity({ name: 'user' })
@Unique(['number'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 300, default: '' })
  lastName: string;

  @Column({ unique: true, name: 'number', nullable: false })
  @Min(10)
  @Max(13)
  number: string;

  @OneToMany(() => OrderProductEntity, (product) => product.user, {})
  basket: OrderProductEntity[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;

  @OneToMany((type) => OrderEntity, (order) => order.user, {
    cascade: true,
  })
  orders: OrderEntity[];
}
