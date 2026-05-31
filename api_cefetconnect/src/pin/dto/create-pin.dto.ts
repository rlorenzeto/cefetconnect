import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoriaPin } from '../../entities/pin.entity';

export class CreatePinDto {
  @ApiProperty({
    example: 'Cálculo I',
    description: 'Nome do pin acadêmico',
  })
  @IsString({ message: 'O nome do Pin deve ser um texto' })
  @MaxLength(100, {
    message: 'O nome do Pin deve ter no máximo 100 caracteres.',
  })
  @IsNotEmpty({ message: 'O nome do Pin é obrigatório.' })
  nomePin: string;

  @ApiPropertyOptional({
    example: 'disciplina',
    enum: CategoriaPin,
    description: 'Categoria do pin.',
  })
  @IsOptional()
  @IsEnum(CategoriaPin, {
    message:
      'A categoria deve ser disciplina, ic, projeto, monitoria, evento, experiencia ou outro.',
  })
  categoriaPin?: CategoriaPin;
}