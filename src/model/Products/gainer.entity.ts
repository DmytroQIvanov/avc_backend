import { ProductEntity } from '../product.entity';
import { UserEntity } from 'src/model/user.entity';

import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'type' })
export class GainerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('simple-array')
  weigth: [string];

  @Column('simple-array')
  taste2: [string];

  @OneToOne((type) => ProductEntity)
  @JoinColumn({ name: 'id_contact' })
  product: ProductEntity;
}
