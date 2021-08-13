import { UserEntity } from 'src/model/user.entity';

import {
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Entity,
    Unique,ManyToOne
} from 'typeorm';

import { Min, Max} from 'class-validator';

@Entity({ name: 'product' })
@Unique(["name"])
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 300, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 3000 })
    description: string;

    @Column()
    price: number;

    @Column({default:0})
    rating: number;

    @Column()
    imageKey: string;
    
    @Column()
    imageName: string;

    @ManyToOne(() => UserEntity, user => user.basket)
    user:UserEntity;

    @Column({default:0})
    quantityOfGoods: number

    
    // @Column()
    // type: ;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;
}
