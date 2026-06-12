import { IsArray, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoverFotosDto {
  @ApiProperty({
    description: 'IDs das fotos a remover. Se não informado, remove todas as fotos do post.',
    required: false,
    type: [String],
    example: ['uuid-foto-1', 'uuid-foto-2'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  ids?: string[];
}
