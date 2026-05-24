import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { Usuario } from '../entities/usuario.entity';
import { Evento } from '../entities/evento.entity';
import { Post } from '../entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Evento, Post])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
