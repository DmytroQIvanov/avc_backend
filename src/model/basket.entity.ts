import { ProductEntity } from './product.entity';

import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
} from 'typeorm';


@Entity({ name: 'basket' })
export class BasketEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 300, nullable: false })
    products: ProductEntity[];


}
