
import {
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Entity,
    Unique,
} from 'typeorm';

import { Min, Max} from 'class-validator';

@Entity({ name: 'admin' })
@Unique(["login"])
export class AdminEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 300, nullable: false })
    password: string;


    @Column({ unique: true, name: 'login', nullable: false })
    login: string;

    @Column()
    firstName: string;
    
    @Column({ type: 'varchar', length: 300 })
    lastName: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

}
