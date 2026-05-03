import { IsString, IsEmail, IsNotEmpty, MaxLength, MinLength, IsStrongPassword } from 'class-validator';
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

  @ApiProperty({ example: 'rafaela.braga@aluno.cefetmg.br', description: 'Endereço de email do aluno' })
  @IsEmail({}, { message: 'Endereço de email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email!: string;

  @ApiProperty({ example: 'senhaSegura123@', description: 'A senha do aluno precisa ter no mínimo 8 caracteres, contendo pelo menos um número, um caractere especial e uma letra maiúscula.' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @IsString({ message: 'A senha deve ser enviada em formato de texto.' })
  @MinLength(8, { message: 'A nova senha deve ter no mínimo 8 caracteres.' })
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,      
    minSymbols: 1,      
    minLowercase: 0,   
    minUppercase: 1,    
  }, { 
    message: 'A senha deve conter obrigatoriamente pelo menos um número, um caractere especial e uma letra maiúscula.' 
  })
  senha!: string;
}
