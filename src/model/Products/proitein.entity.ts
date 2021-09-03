import { ProductEntity } from './../product.entity';
import { UserEntity } from 'src/model/user.entity';

import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'type' })
export class ProteinEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('simple-array')
  weigth: [string];

  @Column('simple-array')
  taste: [string];
}
