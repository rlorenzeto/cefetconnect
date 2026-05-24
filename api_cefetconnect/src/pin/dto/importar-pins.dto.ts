import { IsArray, IsString, MaxLength, IsNotEmpty, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportarPinsDto {
  @ApiProperty({
    example: ['Cálculo I', 'Álgebra Linear', 'Programação Orientada a Objetos'],
    description: 'Lista de nomes de pins a serem importados do Gradment',
    type: [String],
  })
  @IsArray({ message: 'Os pins devem ser fornecidos em uma lista' })
  @ArrayNotEmpty({ message: 'A lista de pins não pode estar vazia' })
  @IsString({ each: true, message: 'Cada pin deve ser um texto' })
  @IsNotEmpty({ each: true, message: 'Nenhum pin pode ter nome vazio' })
  @MaxLength(100, { each: true, message: 'Cada pin deve ter no máximo 100 caracteres' })
  pins: string[];
}
