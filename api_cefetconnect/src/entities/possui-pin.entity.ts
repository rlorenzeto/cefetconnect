import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pin, OrigemPin } from './pin.entity';
import { Usuario } from './usuario.entity';

@Entity('possuiPin')
export class PossuiPin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pin, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'pinIdPin' })
  pin: Pin;

  @ManyToOne(() => Usuario, (usuario) => usuario.pinsAssociados, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioIdUsuario' })
  usuario: Usuario;

  @Column({ type: 'enum', enum: OrigemPin, default: OrigemPin.MANUAL })
  origem: OrigemPin;
}
