import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IconeService } from './icone.service';
import { IconeController } from './icone.controller';
import { Icone } from './entities/icone.entity';
import { PossuiIcone } from './entities/possui-icone.entity';
import { Usuario } from '../entities/usuario.entity';
import { GradmentModule } from '../gradment/gradment.module';
import { InteracaoModule } from '../interacao/interacao.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Icone, PossuiIcone, Usuario]),
    GradmentModule,
    InteracaoModule,
  ],
  controllers: [IconeController],
  providers: [IconeService],
  exports: [IconeService],
})
export class IconeModule {}
