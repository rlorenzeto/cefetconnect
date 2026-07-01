import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Comunidade } from './comunidade.entity';
import { Evento } from './evento.entity.js';
import { Comentario } from './comentario.entity';
import { FotoPost } from './foto-post.entity';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  idPost!: string;

  @Column({ type: 'datetime' })
  dataHoraPublicacao!: Date;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  conteudo?: string;

  @Column({ type: 'boolean', default: false })
  deleted!: boolean;
  // FK Comunidade -> ON DELETE SET NULL
  @ManyToOne(() => Comunidade, (comunidade) => comunidade.posts, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'fk_Comunidade_idComunidade' })
  comunidade!: Comunidade;

  // FK Usuario -> ON DELETE CASCADE
  @ManyToOne(() => Usuario, (usuario) => usuario.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_Usuario_idUsuario' })
  usuario!: Usuario;

  // FK Evento -> ON DELETE SET NULL
  @ManyToOne(() => Evento, (evento) => evento.posts, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'fk_Evento_idEvento' })
  evento!: Evento;

  @OneToMany(() => Comentario, (comentario) => comentario.post)
  comentarios?: Comentario[];

  @OneToMany(() => FotoPost, (foto) => foto.post)
  fotosPost?: FotoPost[];

  totalComentarios?: number;
}