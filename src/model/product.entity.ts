import { GainerEntity } from './Products/gainer.entity';
import { ProteinEntity } from './Products/proitein.entity';
import { UserEntity } from 'src/model/user.entity';

import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  Unique,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Min, Max } from 'class-validator';
import { OrderProductEntity } from './orderProduct';

@Entity()
@Unique(['name'])
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 3000 })
  description: string;

  @Column()
  price: number;

  @Column({ default: 0 })
  rating: number;

  @Column()
  imageKey1: string;

  @Column()
  imageKey2: string;

  @Column()
  imageKey3: string;

  @Column()
  imageName: string;

  @ManyToOne(() => UserEntity, (user) => user.basket)
  user: UserEntity;

  @Column({ default: 0 })
  quantityOfGoods: number;

  @Column({ nullable: false, default: 'protein' })
  type: 'protein' | 'gainer' | 'bcaa';

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;

  @OneToOne((type) => ProteinEntity, { cascade: true })
  @JoinColumn({ name: 'id_contact' })
  typeColumn: ProteinEntity | GainerEntity;

  @Column({ default: false })
  hot: boolean;
}
