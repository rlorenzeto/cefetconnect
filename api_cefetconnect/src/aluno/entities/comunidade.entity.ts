import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from './post.entity';
import { Evento } from './evento.entity';

@Entity('Comunidade')
export class Comunidade {
  @PrimaryGeneratedColumn('uuid') 
  idComunidade!: string;

  @Column({ type: 'varchar', length: 255 })
  nomeComunidade!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descricaoComunidade!: string;

  @OneToMany(() => Post, (post) => post.comunidade)
  posts!: Post[];

  @OneToMany(() => Evento, (evento) => evento.comunidade)
  eventos!: Evento[];
}