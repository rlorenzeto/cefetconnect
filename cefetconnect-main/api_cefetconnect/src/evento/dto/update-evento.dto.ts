import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { CreateEventoDto } from './create-evento.dto';
import { IsString, IsNotEmpty, MaxLength, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventoDto extends PartialType(CreateEventoDto) {

@ApiProperty({description: 'Título do evento', example: 'Palestra sobre Inteligência Artificial',})
@IsString({ message: 'O título do evento deve ser uma string' })
@MaxLength(100)
@IsOptional()
titulo?: string;

@ApiProperty({description: 'Descrição do evento', example: 'Uma palestra detalhada sobre os avanços e aplicações da inteligência artificial.',})
@IsString({ message: 'A descrição do evento deve ser uma string' })
@MaxLength(500)
@IsOptional()
descricaoEvento?: string;

@ApiProperty({description: 'Local do evento', example: 'Auditório',})
@IsString({ message: 'O local do evento deve ser uma string' })
@MaxLength(150)
@IsOptional()
localEvento?: string;

@ApiProperty({description: 'Status do evento', example: true,})
@Transform(({ value }) => value === 'true' || value === '1' || value === true)
@IsBoolean({ message: 'O status deve ser verdadeiro (true) ou falso (false)' })
@IsOptional()
status?: boolean;

@ApiProperty({description: 'Data e horário do evento', example: '2026-10-15T19:00:00',})
@IsDateString({}, { message: 'A data do evento deve estar num formato válido' })
@IsNotEmpty({ message: 'A data do evento é obrigatória' })
@IsOptional()
dataEvento?: string;
}
