import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user.links)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}
