import { UserEntity } from 'src/model/user.entity';

import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  Unique,
  ManyToOne,
  OneToMany, ManyToMany
} from "typeorm";

import { CommentEntity } from './comment.entity';
import { ProductVariantEntity } from './product-variant.entity';

@Entity()
@Unique(['name'])
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  name: string;

  @Column({ length: 3000, default: 'Something' })
  preDescription: string;

  @ManyToMany(() => ProductEntity)
  recommendationProducts: ProductEntity[];

  @Column({ type: 'varchar', length: 3000 })
  description: string;

  @Column({ default: 0 })
  rating: number;

  @ManyToOne(() => UserEntity, (user) => user.basket)
  user: UserEntity;

  @Column()
  type: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;

  @Column({ default: false })
  hot: boolean;

  @OneToMany(() => CommentEntity, (comment) => comment.product, {
    cascade: true,
  })
  comments: CommentEntity[];

  @OneToMany(() => ProductVariantEntity, (product) => product.product, {
    cascade: true,
  })
  productVariant: ProductVariantEntity[];
}
