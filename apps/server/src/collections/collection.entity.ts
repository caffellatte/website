import { User } from '@server/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  // OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('closure-table')
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  // @ManyToOne(() => Collection, (collection) => collection.childCollections)
  // parentCollection: Collection;

  // @OneToMany(() => Collection, (collection) => collection.parentCollection)
  // childCollections: Collection[];
  //
  @TreeChildren()
  children: Collection[];

  @TreeParent()
  parent: Collection;

  @ManyToOne(() => User, (user) => user.collections)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
