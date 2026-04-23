import { IsString, IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ example: '12345678910', description: 'Matrícula do aluno (possui 11 dígitos)' })
  @IsString({ message: 'A matrícula deve ser um texto' })
  @IsNotEmpty({ message: 'A matrícula é obrigatória' })
  @MaxLength(11, { message: 'A matrícula possui 11 caracteres' })
  matricula!: string;

  @ApiProperty({ example: 'Rafaela Braga', description: 'Nome completo do aluno' })
  @IsString({ message: 'O nome de usuário deve ser um texto' })
  @IsNotEmpty({ message: 'O nome de usuário é obrigatório' })
  nomeUsuario!: string;

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
