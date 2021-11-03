import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { WeigthPriceEntity } from './weigth-price.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'ProductVariant' })
export class ProductVariantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageKey1: string;

  @Column({ nullable: true })
  url1: string;

  @Column({ nullable: true })
  imageName: string;

  @Column({ default: 0 })
  quantityOfGoods: number;

  @OneToMany(() => WeigthPriceEntity, (property) => property.product, {
    cascade: true,
  })
  property: WeigthPriceEntity[];

  @Column()
  taste: string;

  @ManyToOne(() => ProductEntity, (product) => product.productVariant)
  product: ProductEntity;
}
