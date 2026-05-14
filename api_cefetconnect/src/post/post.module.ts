import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity'; 
import { Usuario } from '../entities/usuario.entity';
import { FotoPost } from '../entities/foto-post.entity';
import { Comentario } from '../entities/comentario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Usuario, FotoPost, Comentario])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
