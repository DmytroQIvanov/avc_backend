import { ProductEntity } from './product.entity';

import {
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Entity,
    Unique,
} from 'typeorm';

import { Min, Max} from 'class-validator';

@Entity({ name: 'busket' })
export class BasketEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 300, nullable: false })
    products: ProductEntity[];

    @Column()
    totalPrice: number;

}
