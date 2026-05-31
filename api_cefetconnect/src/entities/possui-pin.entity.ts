import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Pin, OrigemPin } from './pin.entity';
import { Usuario } from './usuario.entity';

// O nome da tabela no Workbench está todo em minúsculo
@Entity('possuipin') 
export class PossuiPin {
  // Aponta para a coluna 'fk_Pin_idPin' no banco
  @PrimaryColumn({
    name: 'fk_Pin_idPin',
    type: 'varchar',
    length: 255,
  })
  pinIdPin: string;

  // Aponta para a coluna 'fk_Usuario_idUsuario' no banco
  @PrimaryColumn({ name: 'fk_Usuario_idUsuario', type: 'int' })
  usuarioIdUsuario: number;

  @ManyToOne(() => Pin, { onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @JoinColumn({ name: 'fk_Pin_idPin' }) // Ensina o Join a usar a coluna correta
  pin: Pin;

  @ManyToOne(() => Usuario, (usuario) => usuario.pinsAssociados, { onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @JoinColumn({ name: 'fk_Usuario_idUsuario' }) // Ensina o Join a usar a coluna correta
  usuario: Usuario;

  @Column({
    type: 'varchar',
    length: 50,
    default: OrigemPin.MANUAL,
  })
  origem: OrigemPin;
}