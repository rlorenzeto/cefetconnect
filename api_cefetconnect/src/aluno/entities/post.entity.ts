import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Comunidade } from './comunidade.entity';
import { Evento } from './evento.entity.js';
import { Comentario } from './comentario.entity';

@Entity('Post')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  idPost!: string;

  @CreateDateColumn({ type: 'datetime' }) 
  dataHoraPublicacao!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  arquivo!: string;

  // FK Comunidade -> ON DELETE SET NULL
  @ManyToOne(() => Comunidade, (comunidade) => comunidade.posts, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'fk_Comunidade_idComunidade' })
  comunidade!: Comunidade;

  // FK Usuario -> ON DELETE CASCADE
  @ManyToOne(() => Usuario, (usuario) => usuario.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_Usuario_matricula' })
  usuario!: Usuario;

  // FK Evento -> ON DELETE SET NULL
  @ManyToOne(() => Evento, (evento) => evento.posts, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'fk_Evento_idEvento' })
  evento!: Evento;

  @OneToMany(() => Comentario, (comentario) => comentario.post)
  comentarios!: Comentario[];
}