import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdicionarFotosDto {
  @ApiProperty({
    example: ['https://link-da-imagem.com/foto1.jpg', 'https://link-da-imagem.com/foto2.jpg'],
    description: 'Lista de URLs das imagens a adicionar',
    type: [String],
  })
  @IsArray({ message: 'As fotos devem ser enviadas em formato de lista (array).' })
  @IsString({ each: true, message: 'Cada link de foto deve ser um texto válido.' })
  fotos!: string[]; 
}
