import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComentarioService } from './comentario.service';
import { ComentarioController } from './comentario.controller';
import { Comentario } from '../entities/comentario.entity';
import { Post } from '../entities/post.entity';
import { Usuario } from '../entities/usuario.entity';
import { InteracaoModule } from '../interacao/interacao.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comentario, Post, Usuario]), InteracaoModule],
  controllers: [ComentarioController],
  providers: [ComentarioService],
})
export class ComentarioModule {}
