import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Comunidade } from './comunidade.entity';

export enum OrigemPin {
  MANUAL = 'manual',
  GRADMENT = 'gradment',
}

export enum CategoriaPin {
  DISCIPLINA = 'disciplina',
  IC = 'ic',
  PROJETO = 'projeto',
  MONITORIA = 'monitoria',
  EVENTO = 'evento',
  EXPERIENCIA = 'experiencia',
  OUTRO = 'outro',
}

@Entity('pin')
export class Pin {
  @PrimaryGeneratedColumn('uuid')
  idPin: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  nomePin: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: CategoriaPin.DISCIPLINA,
  })
  categoriaPin: CategoriaPin;

  @ManyToMany(() => Comunidade)
  @JoinTable({
    name: 'relacionadoa',
    joinColumn: {
      name: 'fk_Pin_idPin',
      referencedColumnName: 'idPin',
    },
    inverseJoinColumn: {
      name: 'fk_Comunidade_idComunidade',
      referencedColumnName: 'idComunidade',
    },
  })
  comunidades: Comunidade[];
}
