import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '@server/users/user.entity';

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
  user: User;
}
