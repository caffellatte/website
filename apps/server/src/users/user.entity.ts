import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  //  OneToMany
} from 'typeorm';
// import { Link } from '@server/links/link.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  // @OneToMany(() => Link, (link) => link.user)
  // links: Link[];
}
