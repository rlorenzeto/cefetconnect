import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class AlterarSenhaDto {
  @ApiProperty({ example: 'SenhaAtual@2024', description: 'Senha atual do aluno' })
  @IsString()
  @IsNotEmpty({ message: 'A senha atual é obrigatória' })
  senhaAtual!: string;

  @ApiProperty({ example: 'NovaSenha@2025', description: 'Nova senha (mínimo 8 caracteres, com número, símbolo e letra maiúscula)' })
  @IsString()
  @IsNotEmpty({ message: 'A nova senha é obrigatória' })
  @MinLength(8, { message: 'A nova senha deve ter no mínimo 8 caracteres' })
  @IsStrongPassword(
    { minLength: 8, minNumbers: 1, minSymbols: 1, minLowercase: 0, minUppercase: 1 },
    { message: 'A senha deve conter obrigatoriamente pelo menos um número, um caractere especial e uma letra maiúscula.' },
  )
  novaSenha!: string;
}