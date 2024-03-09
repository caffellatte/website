import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Collection } from '@server/collections/collection.entity';
// import { Link } from '@server/links/link.entity';

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

  // @OneToMany(() => Link, (link) => link.user)
  // links: Link[];
  //
  @OneToMany(() => Collection, (collection) => collection.user)
  collections: Collection[];
}
