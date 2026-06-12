import { IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComentarioDto {
  @ApiProperty({ example: 'Ótima pergunta! Acho que a prova vai ser na semana que vem.' })
  @IsString()
  @IsNotEmpty({ message: 'O texto do comentário não pode estar vazio.' })
  @MaxLength(255, { message: 'O comentário pode ter no máximo 255 caracteres.' })
  texto!: string;
}
