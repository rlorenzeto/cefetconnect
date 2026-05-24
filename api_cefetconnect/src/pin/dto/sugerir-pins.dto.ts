import { IsArray, IsString, MaxLength, IsNotEmpty, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SugerirPinsDto {
  @ApiProperty({
    example: ['Cálculo I', 'Álgebra Linear', 'Programação Orientada a Objetos'],
    description: 'Grade ou histórico acadêmico recebido do Gradment (lista de disciplinas/conquistas)',
    type: [String],
  })
  @IsArray({ message: 'Os dados acadêmicos devem ser fornecidos em uma lista' })
  @ArrayNotEmpty({ message: 'A lista de dados acadêmicos não pode estar vazia' })
  @IsString({ each: true, message: 'Cada item deve ser um texto' })
  @IsNotEmpty({ each: true, message: 'Nenhum item pode ser vazio' })
  @MaxLength(100, { each: true, message: 'Cada item deve ter no máximo 100 caracteres' })
  disciplinas: string[];
}
