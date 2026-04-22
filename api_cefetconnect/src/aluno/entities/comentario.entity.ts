import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Post } from './post.entity';

@Entity('comentario')
export class Comentario {
  @PrimaryGeneratedColumn('uuid')
  idComentario!: string;

  @Column({ type: 'varchar', length: 255 })
  texto!: string;

  @CreateDateColumn({ type: 'datetime' })
  dataHora!: Date;

  // FK Usuario -> ON DELETE CASCADE
  @ManyToOne(() => Usuario, (usuario) => usuario.comentarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_Usuario_matricula' })
  usuario!: Usuario;

  // FK Post -> ON DELETE CASCADE
  @ManyToOne(() => Post, (post) => post.comentarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_Post_idPost' })
  post!: Post;
}