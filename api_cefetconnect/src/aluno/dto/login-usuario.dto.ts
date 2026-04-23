import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUsuarioDto {
  @ApiProperty({ example: 'rafaela.braga@cefetmg.br', description: 'Endereço de email do aluno' })
  @IsEmail({}, { message: 'Forneça um endereço de email válido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email!: string;

  @ApiProperty({ example: 'senhaSegura123', description: 'Senha do aluno (mínimo 6 caracteres)' })
  @IsString({ message: 'A senha deve ser um texto' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha!: string;
}