import { OrderProductEntity } from './orderProduct';

import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  Unique,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Min, Max } from 'class-validator';
import { OrderEntity } from './order.entity';
import { NotificationEntity } from './notification.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'user' })
@Unique(['number'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false, default: '1234' })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: 'guest' })
  firstName: string;

  @Column({ type: 'varchar', length: 300, default: '' })
  lastName: string;

  @Column({ default: 0 })
  discount: number;

  @Column({ unique: true, name: 'number', nullable: false })
  @Min(10)
  @Max(13)
  number: string;

  @OneToMany(() => OrderProductEntity, (product) => product.user, {
    cascade: true,
  })
  basket: OrderProductEntity[];

  @ManyToMany(() => ProductEntity)
  @JoinTable()
  favourite: ProductEntity[];

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
