import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateComunidadeDto {

@ApiProperty({ description: 'O nome da comunidade', example: 'Comunidade de Programação',})
@IsString( { message: 'O nome da comunidade deve ser uma string' })
@IsNotEmpty({ message: 'O nome da comunidade é obrigatório' })
@MaxLength(100) 
nome!: string;

@ApiProperty({ description: 'A descrição da comunidade', example: 'Uma comunidade para discutir sobre programação e compartilhar conhecimentos.',})
@IsString({ message: 'A descrição da comunidade deve ser uma string' })
@IsNotEmpty({ message: 'A descrição da comunidade é obrigatória' })
@MaxLength(500) 
descricao!: string;
}

