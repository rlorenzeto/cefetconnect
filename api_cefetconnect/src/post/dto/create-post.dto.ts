import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {

  @ApiProperty({ example: 'Olá pessoal, boa tarde! Alguém tem informações sobre a prova de Cálculo do professor x?', required: false })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  conteudo?: string;
}
