import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Post } from './post.entity.js';
import { Evento } from './evento.entity.js';
import { Comentario } from './comentario.entity.js';
import { Comunidade } from './comunidade.entity.js';

@Entity('Usuario')
export class Usuario {
  @PrimaryColumn({ type: 'varchar', length: 11 })
  matricula!: string;

  @Column({ type: 'varchar', length: 255 })
  nomeUsuario!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  senha!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  fotoUrl?: string | null;

  @Column({ type: 'varchar', length: 300, nullable: true })
  biografia?: string | null;

  @Column({ type: 'boolean', default: false })
  emailVerificado!: boolean;

  @Column({ type: 'varchar', length: 6, nullable: true })
  codigoVerificacao!: string | null;

  // Relacionamentos 1:N
  @OneToMany(() => Post, (post) => post.usuario)
  posts!: Post[];

  @OneToMany(() => Evento, (evento) => evento.usuario)
  eventos!: Evento[];

  @OneToMany(() => Comentario, (comentario) => comentario.usuario)
  comentarios!: Comentario[];

  @OneToMany(() => Comunidade, (comunidade) => comunidade.criador)
  comunidadesCriadas!: Comunidade[];

  // Relacionamentos N:M
  @ManyToMany(() => Comunidade)
  @JoinTable({
    name: 'participa',
    joinColumn: { name: 'fk_Usuario_matricula', referencedColumnName: 'matricula' },
    inverseJoinColumn: { name: 'fk_Comunidade_idComunidade', referencedColumnName: 'idComunidade' },
  })
  comunidades!: Comunidade[];

  @ManyToMany(() => Post)
  @JoinTable({
    name: 'likePost',
    joinColumn: { name: 'fk_Usuario_matricula', referencedColumnName: 'matricula' },
    inverseJoinColumn: { name: 'fk_Post_idPost', referencedColumnName: 'idPost' },
  })
  postsCurtidos!: Post[];

  @ManyToMany(() => Comentario)
  @JoinTable({
    name: 'likeComentario',
    joinColumn: { name: 'fk_Usuario_matricula', referencedColumnName: 'matricula' },
    inverseJoinColumn: { name: 'fk_Comentario_idComentario', referencedColumnName: 'idComentario' },
  })
  comentariosCurtidos!: Comentario[];
}
