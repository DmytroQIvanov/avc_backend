import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductVariantEntity } from './product-variant.entity';
@Entity()
export class WeigthPriceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  weight: string;

  @Column()
  price: number;

  @ManyToOne(() => ProductVariantEntity, (product) => product.property)
  product: ProductVariantEntity;
}
