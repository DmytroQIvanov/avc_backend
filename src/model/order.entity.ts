import { ProductEntity } from './product.entity';

import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
    Unique,
    OneToOne,
    OneToMany,
} from 'typeorm';

import { Min, Max} from 'class-validator';
import { OrderProductEntity } from './orderProduct';

@Entity({ name: 'busket' })
export class OrderEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 300, nullable: false })
    products: ProductEntity[];

    @OneToMany(() => OrderProductEntity, orderProduct => orderProduct.order)
    orders: OrderProductEntity[];

}
