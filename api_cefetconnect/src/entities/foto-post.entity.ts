import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity('post_fotos')
export class FotoPost {
  @PrimaryGeneratedColumn('uuid', { name: 'id_foto' })
  idFoto!: string;

  @Column({ type: 'varchar', length: 500 })
  url!: string;

  @Column({ type: 'int', default: 0 })
  ordem!: number;

  @CreateDateColumn({ name: 'criada_em', type: 'datetime' })
  criadaEm!: Date;

  // FK Post -> ON DELETE CASCADE
  @ManyToOne(() => Post, (post) => post.fotosPost, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idPost' })
  post!: Post;
}
