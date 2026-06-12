import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteracaoService } from './interacao.service';
import { Usuario } from '../entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [InteracaoService],
  exports: [InteracaoService],
})
export class InteracaoModule {}
