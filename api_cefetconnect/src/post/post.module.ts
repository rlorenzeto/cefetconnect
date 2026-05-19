import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity'; 
import { Usuario } from '../entities/usuario.entity';
import { FotoPost } from '../entities/foto-post.entity';
import { Comentario } from '../entities/comentario.entity';
import { Comunidade } from '../entities/comunidade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Usuario, FotoPost, Comentario, Comunidade])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
