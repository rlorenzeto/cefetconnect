import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreatePinDto } from './create-pin.dto';
import { IsOptional, IsString, MaxLength, IsNotEmpty } from 'class-validator';

export class UpdatePinDto extends PartialType(CreatePinDto) {
    @ApiPropertyOptional({ example: 'Engenharia de Software/Comunidade de Estudos Cálculo I', description: 'Nome das disciplinas do curso/Nome das Comunidades' })
    @IsOptional()
    @IsString({ message: 'O nome do Pin deve ser um texto' })
    @IsNotEmpty({message: "O nome do Pin é obrigatório."})
    @MaxLength(100, {message: "O nome do Pin deve ter no máximo 100 caracteres."})
    nomePin?: string;
}
