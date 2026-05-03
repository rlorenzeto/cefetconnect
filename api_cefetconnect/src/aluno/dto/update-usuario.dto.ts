import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
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
