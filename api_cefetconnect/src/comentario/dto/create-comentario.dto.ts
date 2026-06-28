import { IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComentarioDto {
  @ApiProperty({ example: 'Ótima pergunta! Acho que a prova vai ser na semana que vem. O professor costuma aplicar questões de derivadas e integrais, então é bom revisar esses tópicos. Também recomendo estudar os exercícios da lista 3 que ele passou na última aula.' })
  @IsString()
  @IsNotEmpty({ message: 'O texto do comentário não pode estar vazio.' })
  @MaxLength(500, { message: 'O comentário pode ter no máximo 500 caracteres.' })
  texto!: string;
}
