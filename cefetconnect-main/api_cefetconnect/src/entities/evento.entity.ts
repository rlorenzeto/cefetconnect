import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Comunidade } from './comunidade.entity';
import { Post } from './post.entity';

@Entity('evento')
export class Evento {
  @PrimaryGeneratedColumn('uuid')
  idEvento!: string;

  @Column({ type: 'varchar', length: 255 })
  titulo!: string;

  @Column({ type: 'text', nullable: true })
  descricaoEvento!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  localEvento!: string;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @Column({ type: 'datetime' })
  dataEvento!: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  capaEvento?: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  fotoUrlEvento?: string | null;

  // FK Usuario -> ON DELETE RESTRICT ON UPDATE CASCADE
  @ManyToOne(() => Usuario, (usuario) => usuario.eventos, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'fk_Usuario_idUsuario' })
  usuario!: Usuario;

  // FK Comunidade -> ON DELETE SET NULL
  @ManyToOne(() => Comunidade, (comunidade) => comunidade.eventos, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'fk_Comunidade_idComunidade' })
  comunidade!: Comunidade;

  @OneToMany(() => Post, (post) => post.evento)
  posts!: Post[];

  @ManyToMany(() => Usuario, (usuario) => usuario.eventosParticipados)
  @JoinTable({
    name: 'participaEvento',
    joinColumn: { name: 'eventoIdEvento', referencedColumnName: 'idEvento' },
    inverseJoinColumn: { name: 'usuarioIdUsuario', referencedColumnName: 'idUsuario' },
  })
  participantes!: Usuario[];
}