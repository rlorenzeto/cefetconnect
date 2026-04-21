import { IsString, IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString({ message: 'A matrícula deve ser um texto' })
  @IsNotEmpty({ message: 'A matrícula é obrigatória' })
  @MaxLength(11, { message: 'A matrícula possui 11 caracteres' })
  matricula!: string;

  @IsString({ message: 'O nome de usuário deve ser um texto' })
  @IsNotEmpty({ message: 'O nome de usuário é obrigatório' })
  nomeUsuario!: string;

  @IsEmail({}, { message: 'Forneça um endereço de email válido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email!: string;

  @IsString({ message: 'A senha deve ser um texto' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha!: string;
}
