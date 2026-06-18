import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsStrongPassword, MaxLength } from 'class-validator';

export class LoginUsuarioDto {
  @ApiPropertyOptional({
    example: 'rafaela.braga@email.com',
    description: 'Endereço de email do aluno',
  })
  @IsEmail({}, { message: 'Endereço de email inválido' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'senhaSegura123@', description: 'Senha do aluno' })
  @IsString({ message: 'A senha deve ser um texto' })
  @IsOptional()
  senha?: string;

  @ApiPropertyOptional({ description: 'SSO Token' })
  @IsString()
  @IsOptional()
  ssoToken?: string;

  @ApiPropertyOptional({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token de integração enviado pelo Gradment para vincular as contas. Opcional.',
  })
  @IsOptional()
  @IsString()
  tokenGradment?: string;
}
