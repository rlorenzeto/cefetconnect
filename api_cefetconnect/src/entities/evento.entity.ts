import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Comunidade } from './comunidade.entity';
import { Post } from './post.entity';

@Entity('Evento')
export class Evento {
  @PrimaryGeneratedColumn('uuid')
  idEvento!: string;

  @Column({ type: 'varchar', length: 255 })
  titulo!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descricaoEvento!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  localEvento!: string;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @Column({ type: 'datetime' })
  dataEvento!: Date;

  // FK Usuario -> ON DELETE CASCADE
  @ManyToOne(() => Usuario, (usuario) => usuario.eventos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_Usuario_matricula' })
  usuario!: Usuario;

  // FK Comunidade -> ON DELETE SET NULL
  @ManyToOne(() => Comunidade, (comunidade) => comunidade.eventos, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'fk_Comunidade_idComunidade' })
  comunidade!: Comunidade;

  @OneToMany(() => Post, (post) => post.evento)
  posts!: Post[];
}