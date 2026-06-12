import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Icone } from './icone.entity';
import { Usuario } from '../../entities/usuario.entity';

@Entity('PossuiIcone')
export class PossuiIcone {
  @PrimaryGeneratedColumn()
  idPossuiIcone!: number;

  @ManyToOne(() => Icone, (icone) => icone.possuiIcone, { eager: true })
  @JoinColumn({ name: 'idIcone' })
  icone!: Icone;

  @ManyToOne(() => Usuario, (usuario) => usuario.iconesPossuidos)
  @JoinColumn({ name: 'idUsuario' })
  usuario!: Usuario;

  @CreateDateColumn()
  dataConquistaIcone!: Date;
}
