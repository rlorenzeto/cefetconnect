import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateComentarioDto {
  @ApiPropertyOptional({ example: 'Texto atualizado do comentário.' })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'O comentário pode ter no máximo 500 caracteres.' })
  texto?: string;
}
