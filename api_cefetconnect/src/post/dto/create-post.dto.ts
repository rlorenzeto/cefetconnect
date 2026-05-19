import { IsString, MaxLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {

  @ApiProperty({ example: 'Olá pessoal, boa tarde! Alguém tem informações sobre a prova de Cálculo do professor x?', required: false })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  conteudo?: string;

  @ApiProperty({ example: 'uuid-da-comunidade', required: false, description: 'ID da comunidade onde o post será publicado. O usuário deve ser membro da comunidade.' })
  @IsUUID()
  @IsOptional()
  idComunidade?: string;
}
