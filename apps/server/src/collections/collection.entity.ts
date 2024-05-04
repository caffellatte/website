import { User } from '../users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  // OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('closure-table', {
  closureTableName: 'collection',
  ancestorColumnName: (column) => 'ancestor_' + column.propertyName,
  descendantColumnName: (column) => 'descendant_' + column.propertyName,
})
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
  user: Relation<Omit<User, 'password'>>;
}
