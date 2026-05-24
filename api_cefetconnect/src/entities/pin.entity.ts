import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Comunidade } from './comunidade.entity';

export enum OrigemPin {
  MANUAL = 'manual',
  GRADMENT = 'gradment',
}

@Entity('Pin')
export class Pin {
  @PrimaryGeneratedColumn('uuid')
  idPin: string;

  @Column({ length: 100 })
  nomePin: string;

  @ManyToMany(() => Comunidade)
  @JoinTable({
    name: 'relacionadoA',
    joinColumn: { name: 'pinIdPin', referencedColumnName: 'idPin' },
    inverseJoinColumn: { name: 'comunidadeIdComunidade', referencedColumnName: 'idComunidade' },
  })
  comunidades: Comunidade[];
}
