import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetarSenhaDto {
  @ApiProperty({ example: 'aluno@gmail.com', description: 'E-mail válido do aluno' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email!: string;

  @ApiProperty({ example: '123456', description: 'Código de 6 dígitos enviado por e-mail' })
  @IsString()
  @IsNotEmpty({ message: 'O código de verificação é obrigatório.' })
  @Matches(/^\d{6}$/, { message: 'O código deve conter exatamente 6 dígitos numéricos.' })
  codigo!: string;

  @ApiProperty({ example: 'NovaSenha123!', description: 'A nova senha do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'A nova senha não pode estar vazia.' })
  @MinLength(8, { message: 'A nova senha deve ter no mínimo 8 caracteres.' })
  @MaxLength(25, { message: 'A nova senha deve ter no máximo 25 caracteres.' })
  novaSenha!: string;
}