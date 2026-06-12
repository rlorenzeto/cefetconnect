import { IsString, IsNotEmpty, MaxLength, IsDateString, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateEventoDto {

@ApiProperty({description: 'Título do evento', example: 'Palestra sobre Inteligência Artificial',})
@IsString({ message: 'O título do evento deve ser uma string' })
@IsNotEmpty({ message: 'O título do evento é obrigatório' })
@MaxLength(100)
titulo!: string;

@ApiProperty({description: 'Descrição do evento', example: 'Uma palestra detalhada sobre os avanços e aplicações da inteligência artificial.',})
@IsString({ message: 'A descrição do evento deve ser uma string' })
@IsNotEmpty({ message: 'A descrição do evento é obrigatória' })
@MaxLength(500)
descricaoEvento!: string;

@ApiProperty({description: 'Local do evento', example: 'Auditório',})
@IsString({ message: 'O local do evento deve ser uma string' })
@IsNotEmpty({ message: 'O local do evento é obrigatório' })
@MaxLength(150)
localEvento!: string;

@ApiProperty({description: 'Status do evento', example: true,})
@Transform(({ value }) => value === 'true' || value === '1' || value === true)
@IsBoolean({ message: 'O status deve ser verdadeiro (true) ou falso (false)' })
@IsNotEmpty({ message: 'O status do evento é obrigatório' })
status!: boolean;

@ApiProperty({description: 'Data do evento', example: '2026-10-15T19:00:00'})
@IsDateString({}, { message: 'A data do evento deve estar num formato válido' })
@IsNotEmpty({ message: 'A data do evento é obrigatória' })
dataEvento!: string;

@ApiProperty({description: 'ID da comunidade associada ao evento', example: 'uuid', required: false})
@IsUUID()
@IsOptional()
comunidadeId?: string;
}
