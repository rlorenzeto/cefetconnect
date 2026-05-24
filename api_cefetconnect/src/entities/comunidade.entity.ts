import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';
import { Evento } from './evento.entity';
import { Usuario } from './usuario.entity.js';

@Entity('Comunidade')
export class Comunidade {
  @PrimaryGeneratedColumn('uuid') 
  idComunidade!: string;

  @Column({ type: 'varchar', length: 255 })
  nomeComunidade!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descricaoComunidade!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  capaComunidade?: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  fotoUrlComunidade?: string | null;

  // FK Usuario (criador da comunidade) -> ON DELETE CASCADE
  @ManyToOne(() => Usuario, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'fk_Usuario_idUsuario' })
  criador?: Usuario;

  @OneToMany(() => Post, (post) => post.comunidade)
  posts!: Post[];

  @OneToMany(() => Evento, (evento) => evento.comunidade)
  eventos!: Evento[];
}