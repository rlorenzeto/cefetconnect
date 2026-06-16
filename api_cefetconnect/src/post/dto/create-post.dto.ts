import { IsString, MaxLength, IsOptional, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {

  @ApiProperty({ example: 'Olá pessoal, boa tarde! Alguém tem informações sobre a prova de Cálculo do professor x?', required: false })
  @IsString()
  @MinLength(20, { message: 'O conteúdo do post deve ter pelo menos 10 caracteres.' })
  @MaxLength(1000)
  @IsOptional()
  conteudo?: string;

  @ApiProperty({ example: 'uuid-da-comunidade', required: false, description: 'ID da comunidade onde o post será publicado. O usuário deve ser membro da comunidade.' })
  @IsUUID()
  @IsOptional()
  idComunidade?: string;
}
