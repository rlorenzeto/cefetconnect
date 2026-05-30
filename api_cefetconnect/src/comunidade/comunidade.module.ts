import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComunidadeService } from './comunidade.service';
import { ComunidadeController } from './comunidade.controller';
import { Comunidade } from '../entities/comunidade.entity';
import { Usuario } from '../entities/usuario.entity';
import { GradmentModule } from '../gradment/gradment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comunidade, Usuario]), GradmentModule],
  controllers: [ComunidadeController],
  providers: [ComunidadeService],
})
export class ComunidadeModule {}
