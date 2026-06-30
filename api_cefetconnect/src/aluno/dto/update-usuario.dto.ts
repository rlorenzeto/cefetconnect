import { PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @ApiPropertyOptional({ example: '12345678900', description: 'Matrícula do aluno/professor fornecida pelo SIGAA' })
  @IsOptional()
  @IsString({ message: 'A matrícula deve ser um texto' })
  @Matches(/^\d{7}$|^\d{11}$/, { message: 'A matrícula deve ter 7 dígitos (caso seja professor) ou 11 dígitos (caso seja aluno)' })
  matricula?: string;

  @ApiPropertyOptional({
    example: '2000-05-15',
    description: 'Data de nascimento no formato YYYY-MM-DD.',
  })
  @IsOptional()
  @IsDateString({}, { message: 'A data de nascimento deve estar no formato YYYY-MM-DD' })
  dataNascimento?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Confirma se o usuário aceitou os termos.',
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean({ message: 'O campo de aceite dos termos deve ser verdadeiro ou falso' })
  aceitouTermos?: boolean;
  
  @ApiPropertyOptional({ example: 'NovaSenha@2024', description: 'Nova senha do aluno (mínimo 8 caracteres, com número, símbolo e letra maiúscula)' })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'A nova senha deve ter no mínimo 8 caracteres' })
  @IsStrongPassword(
    { minLength: 8, minNumbers: 1, minSymbols: 1, minLowercase: 0, minUppercase: 1 },
    { message: 'A senha deve conter obrigatoriamente pelo menos um número, um caractere especial e uma letra maiúscula.' },
  )
  senha?: string;

  @ApiPropertyOptional({ example: 'Estudante de Engenharia de Computação no CEFET-MG.', description: 'Biografia do usuário (máximo 300 caracteres)' })
  @IsOptional()
  @IsString({ message: 'A biografia deve ser um texto' })
  @MaxLength(300, { message: 'A biografia deve ter no máximo 300 caracteres' })
  biografia?: string;
}
