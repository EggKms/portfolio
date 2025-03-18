import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userNo: number;

  @Column()
  userId: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  regDate: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateDate: Date;

  @Column({ default: 0 })
  deleteYn: number;
}
