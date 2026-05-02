import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsStrongPassword } from 'class-validator';

export class LoginUsuarioDto {
  @ApiProperty({
    example: 'rafaela.braga@email.com',
    description: 'Endereço de email do aluno',
  })
  @IsEmail({}, { message: 'Endereço de email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email!: string;

  @ApiProperty({ example: 'senhaSegura123@', description: 'Senha do aluno deve conter no mínimo 8 caracteres, com pelo menos um número, um caractere especial e uma letra maiúscula' })
  @IsString({ message: 'A senha deve ser um texto' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
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
