import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity({ name: 'password' })
export class PasswordEntity {
  @Column({ type: 'varchar', length: 300, nullable: false, default: '1234' })
  password: string;
}
