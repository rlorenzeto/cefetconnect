import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComunidadeService } from './comunidade.service';
import { ComunidadeController } from './comunidade.controller';
import { Comunidade } from '../entities/comunidade.entity';
import { Usuario } from '../entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comunidade, Usuario])],
  controllers: [ComunidadeController],
  providers: [ComunidadeService],
})
export class ComunidadeModule {}
