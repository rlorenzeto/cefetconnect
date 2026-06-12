import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsString, MaxLength, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(CreatePostDto) {

@ApiProperty({ example: 'Olá pessoal, boa tarde! Alguém tem informações sobre a prova de Cálculo do professor x?', required: false })
@IsString()
@MaxLength(1000)
@IsOptional()
conteudo?: string;
    
@ApiProperty({ 
    example: ['https://link1.com', 'https://link2.com'], 
    required: false,
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fotos?: string[];
}

