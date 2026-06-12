import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerificarEmailDto {
  @ApiProperty({ example: '123456', description: 'Código de 6 dígitos recebido por e-mail' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'O código deve ter exatamente 6 dígitos.' })
  codigo!: string;
}
