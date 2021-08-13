import { ProductEntity } from './product.entity';

import {
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Entity,
    Unique,
    OneToOne,
    JoinColumn,
    PrimaryColumn,
    OneToMany
} from 'typeorm';

import { Min, Max} from 'class-validator';
import { BasketEntity } from './basket.entity';

@Entity({ name: 'user' })
@Unique(["number"])
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 300, nullable: false })
    password: string;

    @Column({ type: 'varchar', length: 300 })
    lastName: string;

    @Column({ unique: true, name: 'number', nullable: false })
    @Min(10)
    @Max(13)
    number: string;

    @Column()
    firstName: string;

    // @OneToOne(()=>BasketEntity)
    // @JoinColumn()
    // basket:BasketEntity

    @OneToMany(()=>ProductEntity, product => product.user)
    basket:ProductEntity[]

    // @Column({ type: 'boolean', default: true })
    // isActive: boolean;

    // @Column({ type: 'boolean', default: false })
    // isArchived: boolean;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    // @Column({ type: 'varchar', length: 300 })
    // createdBy: string;

    // @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    // lastChangedDateTime: Date;

    // @Column({ type: 'varchar', length: 300 })
    // lastChangedBy: string;

    // @Column({ type: 'varchar', length: 300, nullable: true })
    // internalComment: string | null;
}
