import { ProductEntity } from './product.entity';

import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'post' })
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  content: string;

  //   @Column()
  //   imageKey1: string;

  @CreateDateColumn()
  dataCreated: Date;
}
