import { IsString, IsEmail, IsNotEmpty, MaxLength, MinLength, IsStrongPassword, Matches, IsDateString, IsBoolean, Equals, ValidatorConstraint, ValidatorConstraintInterface, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'maiorDeIdade', async: false })
export class MaiorDeIdadeConstraint implements ValidatorConstraintInterface {
  validate(dataNascimento: string) {
    if (!dataNascimento || !/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) {
      return false;
    }

    const [ano, mes, dia] = dataNascimento.split('-').map(Number);

    if (!ano || !mes || !dia) {
      return false;
    }

    if (ano < 1930) {
      return false;
    }

    const nascimento = new Date(ano, mes - 1, dia);

    const dataExiste =
      nascimento.getFullYear() === ano &&
      nascimento.getMonth() === mes - 1 &&
      nascimento.getDate() === dia;

    if (!dataExiste) {
      return false;
    }

    const hoje = new Date();

    let idade = hoje.getFullYear() - ano;

    const aniversarioJaPassou =
      hoje.getMonth() > mes - 1 ||
      (hoje.getMonth() === mes - 1 && hoje.getDate() >= dia);

    if (!aniversarioJaPassou) {
      idade -= 1;
    }

    return idade >= 18 && idade <= 120;
  }

  defaultMessage() {
    return 'Digite uma data de nascimento válida. O usuário deve ter entre 18 e 120 anos.';
  }
}

export class CreateUsuarioDto {
  @ApiProperty({ example: '12345678910 ou 1234567', description: 'Matrícula do usuário: 11 dígitos para aluno ou 7 dígitos para professor' })
  @IsString({ message: 'A matrícula deve ser um texto' })
  @IsNotEmpty({ message: 'A matrícula é obrigatória' })
  @Matches(/^\d{7}$|^\d{11}$/, { message: 'A matrícula deve ter 7 dígitos (caso seja professor) ou 11 dígitos (caso seja aluno)' })
  matricula!: string;

  @ApiProperty({ example: 'Maria da Silva', description: 'Nome completo do aluno/professor' })
  @IsString({ message: 'O nome de usuário deve ser um texto' })
  @IsNotEmpty({ message: 'O nome de usuário é obrigatório' })
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
    message: 'O nome deve conter apenas letras e espaços.',
  })
  nomeUsuario!: string;

  @ApiProperty({ example: 'maria.silva@gmail.com', description: 'Endereço de email do aluno/professor' })
  @IsEmail({}, { message: 'Endereço de email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email!: string;

  @ApiProperty({ example: 'senhaSegura123@', description: 'A senha do usuário precisa ter no mínimo 8 caracteres, contendo pelo menos um número, um caractere especial e uma letra maiúscula.' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @IsString({ message: 'A senha deve ser enviada em formato de texto.' })
  @MinLength(8, { message: 'A nova senha deve ter no mínimo 8 caracteres.' })
  @MaxLength(25, { message: 'A senha deve ter no máximo 25 caracteres.' })
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

  @ApiProperty({ example: '2000-05-15', description: 'Data de nascimento no formato YYYY-MM-DD. O usuário deve ter pelo menos 18 anos.' })
  @IsNotEmpty({ message: 'A data de nascimento é obrigatória' })
  @IsDateString({}, { message: 'A data de nascimento deve estar no formato YYYY-MM-DD' })
  @Validate(MaiorDeIdadeConstraint)
  dataNascimento!: string;

  @ApiProperty({ example: true, description: 'O usuário deve aceitar os termos de compromisso para se cadastrar' })
  @IsBoolean({ message: 'O campo de aceite dos termos deve ser verdadeiro ou falso' })
  @Equals(true, { message: 'Você deve aceitar os termos de compromisso para se cadastrar' })
  aceitouTermos!: boolean;
}
