import { Collection } from '../collections/collection.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Link } from '../links/link.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  // @Column()
  // firstName: string;

  // @Column()
  // lastName: string;

  // @Column({ default: true })
  // isActive: boolean;

  @OneToMany(() => Link, (link) => link.user)
  links: Relation<Link[]>;

  @OneToMany(() => Collection, (collection) => collection.user)
  collections: Relation<Collection[]>;
}
