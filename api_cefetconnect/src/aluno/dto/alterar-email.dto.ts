import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class AlterarEmailDto {
  @ApiProperty({ example: 'novo@email.com', description: 'Novo endereço de e-mail (.com, .br ou .net)' })
  @IsEmail({}, { message: 'Endereço de e-mail inválido' })
  @Matches(/\.(com|br|net)$/i, { message: 'O e-mail deve terminar em .com, .br ou .net' })
  @IsNotEmpty({ message: 'O novo e-mail é obrigatório' })
  novoEmail!: string;

  @ApiProperty({ example: 'SenhaAtual@2024', description: 'Senha atual para confirmar a alteração' })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória para confirmar a alteração' })
  senha!: string;
}