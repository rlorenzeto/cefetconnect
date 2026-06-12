import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PinService } from './pin.service';
import { PinController } from './pin.controller';
import { Pin } from '../entities/pin.entity';
import { PossuiPin } from '../entities/possui-pin.entity';
import { Usuario } from '../entities/usuario.entity';
import { Comunidade } from '../entities/comunidade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pin, PossuiPin, Usuario, Comunidade])],
  controllers: [PinController],
  providers: [PinService],
})
export class PinModule {}
