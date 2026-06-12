import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PossuiIcone } from './possui-icone.entity';

@Entity('Icone')
export class Icone {
  @PrimaryGeneratedColumn()
  idIcone!: number;

  @Column({ type: 'varchar', length: 255 })
  nomeIcone!: string;

  @Column({ type: 'varchar', length: 255 })
  descricaoIcone!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigoIcone!: string;

  @OneToMany(() => PossuiIcone, (possui) => possui.icone)
  possuiIcone!: PossuiIcone[];
}
