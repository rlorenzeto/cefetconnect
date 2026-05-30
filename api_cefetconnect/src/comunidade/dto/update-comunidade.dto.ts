import { PartialType } from '@nestjs/swagger';
import { CreateComunidadeDto } from './create-comunidade.dto';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateComunidadeDto extends PartialType(CreateComunidadeDto) {

@ApiProperty({ description: 'O nome da comunidade', example: 'Comunidade de Programação',})
@IsOptional()
@IsString({ message: 'O nome da comunidade deve ser uma string' })
@MaxLength(100) 
nomeComunidade?: string;

@ApiProperty({ description: 'A descrição da comunidade', example: 'Uma comunidade para discutir sobre programação e compartilhar conhecimentos.',})
@IsOptional()
@IsString({ message: 'A descrição da comunidade deve ser uma string' })
@MaxLength(500) 
descricaoComunidade?: string;
}
