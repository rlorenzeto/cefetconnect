import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PossuiIcone } from './possui-icone.entity';

@Entity('Icone')
export class Icone {
  @PrimaryGeneratedColumn()
  idIcone!: number;

  @Column({ type: 'varchar', length: 255 })
  nomeIcone!: string;

  @Column({ type: 'varchar', length: 255 })
  descricaoIcone!: string; // Qual eixo (ex: 'Matemática', 'Física', 'Química')

  @Column({ type: 'varchar', length: 50, unique: true })
  codigoIcone!: string; // Código único do ícone (ex: 'MAT-001', 'FIS-002')

  @OneToMany(() => PossuiIcone, (possui) => possui.icone)
  possuiIcone!: PossuiIcone[];
}
