import { OrderProductEntity } from './orderProduct';
import { ProductEntity } from './product.entity';

import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  Unique,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Min, Max } from 'class-validator';

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

  @OneToMany(() => OrderProductEntity, (product) => product.user)
  basket: OrderProductEntity[];

  // @Column({ type: 'boolean', default: false })
  // isArchived: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;
}
