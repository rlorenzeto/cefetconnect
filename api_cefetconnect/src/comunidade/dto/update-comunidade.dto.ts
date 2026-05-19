import { PartialType } from '@nestjs/swagger';
import { CreateComunidadeDto } from './create-comunidade.dto';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateComunidadeDto extends PartialType(CreateComunidadeDto) {

@ApiProperty({ description: 'O nome da comunidade', example: 'Comunidade de Programação',})
@IsString({ message: 'O nome da comunidade deve ser uma string' })
@IsNotEmpty({ message: 'O nome da comunidade é obrigatório' })
@MaxLength(100) 
nome?: string;

@ApiProperty({ description: 'A descrição da comunidade', example: 'Uma comunidade para discutir sobre programação e compartilhar conhecimentos.',})
@IsString({ message: 'A descrição da comunidade deve ser uma string' })
@IsNotEmpty({ message: 'A descrição da comunidade é obrigatória' })
@MaxLength(500) 
descricao?: string;

}
