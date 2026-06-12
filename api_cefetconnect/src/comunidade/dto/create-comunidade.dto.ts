import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsInt, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateComunidadeDto {

@ApiProperty({ description: 'O nome da comunidade', example: 'Comunidade de Programação',})
@IsString( { message: 'O nome da comunidade deve ser uma string' })
@IsNotEmpty({ message: 'O nome da comunidade é obrigatório' })
@MaxLength(100) 
nomeComunidade!: string;

@ApiProperty({ description: 'A descrição da comunidade', example: 'Uma comunidade para discutir sobre programação e compartilhar conhecimentos.',})
@IsString({ message: 'A descrição da comunidade deve ser uma string' })
@IsNotEmpty({ message: 'A descrição da comunidade é obrigatória' })
@MaxLength(500) 
descricaoComunidade!: string;

@ApiPropertyOptional({ description: 'ID da disciplina do Gradment vinculada à comunidade', example: 1001 })
@IsOptional()
@IsInt({ message: 'O ID da disciplina deve ser um número inteiro' })
@Type(() => Number)
gradmentDisciplinaId?: number;
}

