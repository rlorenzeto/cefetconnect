import { IsNotEmpty, IsString, MaxLength, IsEnum, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { OrigemPin } from "../../entities/pin.entity";

export class CreatePinDto {
@ApiProperty({ example: 'Cálculo I', description: 'Nome do pin acadêmico' })
@IsString({ message: 'O nome do Pin deve ser um texto' })
@MaxLength(100, {message: "O nome do Pin deve ter no máximo 100 caracteres."})
@IsNotEmpty({message: "O nome do Pin é obrigatório."})
nomePin: string;

@ApiPropertyOptional({ example: 'manual', enum: OrigemPin, description: 'Origem do pin: manual (padrão) ou gradment (importado/validado)' })
@IsEnum(OrigemPin, { message: 'A origem deve ser "manual" ou "gradment"' })
@IsOptional()
origem?: OrigemPin;
}
