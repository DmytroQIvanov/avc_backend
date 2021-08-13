import { OrderEntity } from './order.entity';
import { ProductEntity } from './product.entity';

import {
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Entity,
    Unique,
    OneToOne,
    JoinColumn,
    ManyToOne,
} from 'typeorm';

import { Min, Max} from 'class-validator';

@Entity({ name: 'busket' })
export class OrderProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 300, nullable: false })
    product: ProductEntity
    
    @Min(0)
    @Column()
    quantity: number

    @ManyToOne(()=>OrderEntity,order=>order.products)
    order:OrderEntity
}
